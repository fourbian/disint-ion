import { DisintCommentMetadata } from "./Metadata";

export class DisintComment<T> {

    constructor(content: T) {
        this.content = content;
    }
    id: string;
    cid: string;
    allCommitIds: string[];
    commitId: string;
    tipCid: string;
    controllers: string[];
    mimetype: string;

    metadata: DisintCommentMetadata;

    parentIds: string[] = []; // attach this comment to a parent comment, if you are a controller
    childrenIds: string[] = []; // add children to this comment, if you are a controller

    content: T;

    static from(obj: any): DisintComment<any> {
        let comment = new DisintComment<any>(null);
        Object.assign(comment, obj);

        comment.allCommitIds = comment.allCommitIds || [];
        comment.childrenIds = comment.childrenIds || [];
        comment.controllers = comment.controllers || [];
        comment.parentIds = comment.parentIds || [];

        return comment;
    }
}