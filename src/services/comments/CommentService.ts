import { ICommentService } from "./ICommentService";
import { LocalStorageCommentService } from "./LocalStorageCommentService";
import { userService } from '../users/UserService';

let commentService: ICommentService;

if (process.env.NODE_ENV == "development") {
    commentService = new LocalStorageCommentService(userService);
} else {
    throw new Error(`No comment service defined for ${process.env.NODE_ENV}`);
}

export { commentService }