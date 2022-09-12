export class CommentQuery {
    constructor(obj: any = null) {
        Object.assign(this, obj || {});
    }

    parentId: string;
}