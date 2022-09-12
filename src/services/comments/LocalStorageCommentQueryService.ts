import { DisintComment } from "../../models/DisintComment";
import { v4 as uuidv4 } from 'uuid';
import { ICommentQueryService } from "./ICommentQueryService";

export class LocalStorageCommentQueryService implements ICommentQueryService {
    private load(): DisintComment<any>[] {
        const dbString = localStorage.getItem('disint.db');
        return dbString ? JSON.parse(dbString as string) : [];
    }

    async mine(): Promise<DisintComment<any>[]> {
        return this.load().map(c => DisintComment.from(c));
    }

    async all(): Promise<DisintComment<any>[]> {
        return this.load();
    }
    

}