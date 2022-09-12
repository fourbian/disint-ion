import { CommentQuery } from "../../models/CommentQuery";
import { DisintComment } from "../../models/DisintComment";
import { ICommentQueryService } from "./ICommentQueryService";

export class LocalStorageCommentQueryService implements ICommentQueryService {
    private load(): DisintComment<any>[] {
        const dbString = localStorage.getItem('disint.db');
        const comments = dbString ? JSON.parse(dbString as string) : [];
        return comments.map((c: any) => new DisintComment(c));
    }

    private async query(query: CommentQuery): Promise<DisintComment<any>[]> {
        let comments = this.load();
        if (query.parentId) {
            let parentFilter = (c: DisintComment<any>) => {
                let matchingParentWithAnyChildren = c.id == query.parentId && c.childrenIds?.length;
                let anyChildWithMatchingParent = c.parentIds?.includes(query.parentId);
                return matchingParentWithAnyChildren || anyChildWithMatchingParent;
            }
            comments = comments.filter(parentFilter);
        }
        return comments;
    }

    async mine(query: CommentQuery): Promise<DisintComment<any>[]> {
        // TODO: update query to set current user id somehow
        return await this.query(query);
    }

    async all(query: CommentQuery): Promise<DisintComment<any>[]> {
        return await this.query(query);
    }


}