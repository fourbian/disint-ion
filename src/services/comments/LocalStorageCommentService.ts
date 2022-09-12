import { DisintComment } from "../../models/DisintComment";
import { ICommentService } from "./ICommentService";
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageCommentQueryService } from "./LocalStorageCommentQueryService";

export class LocalStorageCommentService implements ICommentService {
    queryService = new LocalStorageCommentQueryService();
    comments: DisintComment<any>[] = [];

    constructor() {
        this.queryService.all().then(comments => this.comments = comments);
    }

    async add<T>(content: T, mimetype: string): Promise<void> {
        let comment = new DisintComment<T>(content);
        comment.id = uuidv4();
        comment.cid = 'c' + comment.id;
        comment.mimetype = mimetype;

        this.comments.push(comment);

        this.saveComments();
    }

    private saveComments() {
        let commentsString = JSON.stringify(this.comments);
        if (commentsString.length > (1024 * 1024)) {
            alert("Comment storage as reached 1MB of its 5MB limit");
        }

        localStorage.setItem('disint.db', commentsString);
    }

}