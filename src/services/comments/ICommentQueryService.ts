import { CommentQuery } from '../../models/CommentQuery';
import { DisintComment } from '../../models/DisintComment';

export interface ICommentQueryService {
    mine(query: CommentQuery): Promise<DisintComment<any>[]>;
    all(query: CommentQuery):  Promise<DisintComment<any>[]>;
}
