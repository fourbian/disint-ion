import { ICommentQueryService } from "./ICommentQueryService";
import { LocalStorageCommentQueryService } from "./LocalStorageCommentQueryService";

let commentQueryService: ICommentQueryService;

if (process.env.NODE_ENV == "development") {
    commentQueryService = new LocalStorageCommentQueryService();
} else {
    throw new Error(`No service defined for ${process.env.NODE_ENV}`);
}

export { commentQueryService }