import { CommentQuery } from '../../models/CommentQuery';
import { DisintComment } from '../../models/DisintComment';

export interface ICommentQueryService {
    query(options: CommentQuery): Promise<DisintComment<any>[]>;
}
