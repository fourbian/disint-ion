import { DisintComment } from '../../models/DisintComment';

export class Mimetypes
{
    static readonly MARKDOWN = "text/string";
}

export interface ICommentService {
    create<T>(content: T, mimetype: string, parentCommentId: string): Promise<void>;
    load<T>(commentId: string): Promise<DisintComment<T>>;

}
