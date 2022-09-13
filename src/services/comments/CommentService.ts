import { ICommentService } from "./ICommentService";
import { LocalStorageCommentService } from "./LocalStorageCommentService";

let commentService: ICommentService;

if (process.env.NODE_ENV == "development") {
    commentService = new LocalStorageCommentService();
} else {
    throw new Error(`No comment service defined for ${process.env.NODE_ENV}`);
}

export {commentService}