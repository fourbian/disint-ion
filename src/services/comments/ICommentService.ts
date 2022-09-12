import { DisintComment } from '../../models/DisintComment';

export class Mimetypes
{
    static readonly MARKDOWN = "text/string";
}

export interface ICommentService {
    add<T>(content: T, mimetype: string): Promise<void>;
}
