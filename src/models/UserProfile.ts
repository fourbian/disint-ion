import Joi from 'joi';

export class UserProfile {

    constructor(obj:any = null) {
        if (obj) {
            Object.assign(this, obj);

            this.avatar = obj.avatar;
            this.username = obj.username;
            this.userId = obj.userId;
        }
    }    

    avatar: string;
    username: string;
    userId: string;

    followingUserIds: string[] = [];

    isEqual(other: UserProfile): boolean {
        if (!other) return false;
        let thisFollowingUserIds = this.followingUserIds || [];
        let otherFollowingUserIds = other.followingUserIds || [];
        let hasSameFollowingUserIds = thisFollowingUserIds.sortBy(x => x).equals(otherFollowingUserIds.sortBy(x => x));
        let hasSameAvatar = this.avatar == other.avatar;
        let hasSameUsername = this.username == other.username;

        let isEqual = hasSameFollowingUserIds && hasSameAvatar && hasSameUsername;
        //console.log(isEqual, "*****");
        return isEqual;

    }    
}

export const userProfileSchema: Joi.ObjectSchema<UserProfile> = Joi.object({
    username: Joi.string().required(),
    avatar: Joi.string().uri(),
    userId: Joi.string().min(20).max(40).required(),

    followingUserIds: Joi.array()
});