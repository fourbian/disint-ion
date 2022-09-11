import { ICommentService } from "./ICommentService";
import { StorageCommentService } from "./StorageCommentService";

let commentService: ICommentService;

if (process.env.NODE_ENV == "development") {
    commentService = new StorageCommentService();
} else {
    throw new Error(`No service defined for ${process.env.NODE_ENV}`);
}

export {commentService}