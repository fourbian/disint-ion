import { DisintComment } from '../models/DisintComment';

export interface ICommentService {
    add<T>(comment: DisintComment<T>): void;
}
