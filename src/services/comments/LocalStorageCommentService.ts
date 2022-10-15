import { DisintComment } from "../../models/DisintComment";
import { ICommentService } from "./ICommentService";
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageCommentQueryService } from "./LocalStorageCommentQueryService";
import { CommentQuery } from "../../models/CommentQuery";
import { IUserService } from "../users/IUserService";

export class LocalStorageCommentService implements ICommentService {
    queryService: LocalStorageCommentQueryService;
    comments: DisintComment<any>[] = [];
    userService: IUserService;

    constructor(userService: IUserService) {
        this.queryService = new LocalStorageCommentQueryService(userService);
        this.queryService.query(new CommentQuery()).then(comments => this.comments = comments);
        this.userService = userService;
    }

    async create<T>(content: T, mimetype: string, parentCommentId: string = ""): Promise<void> {
        let comment = new DisintComment<T>({ content });
        comment.id = uuidv4();
        comment.cid = 'c' + comment.id;
        comment.mimetype = mimetype;
        comment.userId = (await this.userService.readProfile()).userId;
        if (parentCommentId) comment.parentIds = [parentCommentId];

        this.comments.push(comment);

        this.saveComments();
    }

    async load<T>(commentId: string): Promise<DisintComment<T>> {
        return await this.queryService.load<T>(commentId);
    }

    private saveComments() {
        let commentsString = JSON.stringify(this.comments);
        if (commentsString.length > (1024 * 1024)) {
            alert("Comment storage as reached 1MB of its 5MB limit");
        }

        localStorage.setItem('disint.db.comments', commentsString);
    }

}