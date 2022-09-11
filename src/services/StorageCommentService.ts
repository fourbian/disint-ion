import { DisintComment } from "../models/DisintComment";
import { ICommentService } from "./ICommentService";

export class StorageCommentService implements ICommentService {
    add<T>(comment: DisintComment<T>): void {
        throw new Error("Implement this add!");
    }

}