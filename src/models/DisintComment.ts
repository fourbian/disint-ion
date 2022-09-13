import { DisintCommentMetadata } from "./Metadata";

export class DisintComment<T> {

    constructor(obj:any = null) {
        Object.assign(this, obj);

        this.allCommitIds = this.allCommitIds || [];
        this.childrenIds = this.childrenIds || [];
        this.controllers = this.controllers || [];
        this.parentIds = this.parentIds || [];
    }
    id: string;
    cid: string;
    allCommitIds: string[];
    commitId: string;
    tipCid: string;
    userId: string;
    controllers: string[];
    mimetype: string;

    metadata: DisintCommentMetadata;

    parentIds: string[] = []; // attach this comment to a parent comment, if you are a controller
    childrenIds: string[] = []; // add children to this comment, if you are a controller

    content: T;

}