import { IUserService } from "../services/users/IUserService";

export class CommentQuery {
    userService: IUserService;
    promises: Promise<any>[] = [];
    constructor(obj?: (IUserService | CommentQuery | any), userService?: IUserService) {
        if (obj?.isAuthenticated) {
            this.userService = obj;
        } else if (obj) {
            Object.assign(this, obj || {});
        }

        if (userService) {
            this.userService = userService;
        }
    }

    parentId: string;
    userIds: string[] = [];

    mine(): CommentQuery {
        if (!this.userService) throw new Error("Must pass IUserService to constructor of CommentQuery before using this function");
        const promise = this.userService.readProfile().then(u => {
            this.userIds.push(u.userId);
        });
        this.promises.push(promise);
        return this;
    }

    async wait(): Promise<CommentQuery> {
        await Promise.all(this.promises);
        return this;
    }
}