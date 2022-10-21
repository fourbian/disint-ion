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
    isTopLevel: boolean = false;
    userIds: string[] = [];

    mine(): CommentQuery {
        if (!this.userService) throw new Error("Must pass IUserService to constructor of CommentQuery before using this function");
        const promise = this.userService.readCurrentUserProfile().then(u => {
            if (u) {
                this.userIds.push(u.userId);
            }
        });
        this.promises.push(promise);
        return this;
    }

    following(): CommentQuery {
        if (!this.userService) throw new Error("Must pass IUserService to constructor of CommentQuery before using this function");
        const promise = this.userService.readCurrentUserProfile().then(u => {
            if (u) {
                for (let followingUserId of u.followingUserIds) {
                    this.userIds.push(followingUserId);
                }
            }
        });
        this.promises.push(promise);
        return this;
    }

    parentOrTopLevel(parentId: string) {
        //console.log("parentOrTopLevel", parentId)
        this.parentId = parentId;
        this.isTopLevel = !parentId;
        return this;
    }

    async wait(): Promise<CommentQuery> {
        await Promise.all(this.promises);
        return this;
    }

    async isEqual(other: CommentQuery): Promise<boolean> {
        if (!other) return false;
        await Promise.all([this.wait(), other.wait()])
        let thisUserIds = this.userIds || [];
        let otherUserIds = other.userIds || [];
        let hasSameUserIds = thisUserIds.sortBy(x => x).equals(otherUserIds.sortBy(x => x));
        let hasSameParentId = this.parentId == other.parentId;
        let hasSameTopLevel = this.isTopLevel == other.isTopLevel;

        let isEqual = hasSameParentId && hasSameUserIds && hasSameTopLevel;
        //console.log(isEqual, "*****");
        return isEqual;

    }
}