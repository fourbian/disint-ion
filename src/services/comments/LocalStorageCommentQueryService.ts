import { CommentQuery } from "../../models/CommentQuery";
import { DisintComment } from "../../models/DisintComment";
import { IUserService } from "../users/IUserService";
import { ICommentQueryService } from "./ICommentQueryService";

export class LocalStorageCommentQueryService implements ICommentQueryService {

    constructor(userService: IUserService) {

    }

    private _loadAllComments(): DisintComment<any>[] {
        const dbString = localStorage.getItem('disint.db.comments');
        const comments = dbString ? JSON.parse(dbString as string) : [];
        return comments.map((c: any) => new DisintComment(c));
    }

    public async query(options?: CommentQuery): Promise<DisintComment<any>[]> {

        if (!options) options = new CommentQuery();

        options = await options.wait();

        let comments = this._loadAllComments();
        if (options.parentId) {
            const parentId = options.parentId;
            let parentFilter = (c: DisintComment<any>) => {
                let matchingParentWithAnyChildren = c.id == parentId && c.childrenIds?.length;
                let anyChildWithMatchingParent = c.parentIds?.includes(parentId);
                return matchingParentWithAnyChildren || anyChildWithMatchingParent;
            }
            comments = comments.filter(parentFilter);
        }
        if (options?.userIds.length) {
            comments = comments.filter(c => options?.userIds.includes(c.userId));
        }
        return comments;
    }

    // Dev: only
    public load<T>(commentId: string): DisintComment<T> {
        let comments = this._loadAllComments();
        return comments.filter(c => c.id == commentId)[0];
    }

}