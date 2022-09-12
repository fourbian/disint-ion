import { DisintComment } from '../../models/DisintComment';

export interface ICommentQueryService {
    mine(): Promise<DisintComment<any>[]>;
    all():  Promise<DisintComment<any>[]>;
}
