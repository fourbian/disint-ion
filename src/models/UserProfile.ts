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
}

export const userProfileSchema: Joi.ObjectSchema<UserProfile> = Joi.object({
    username: Joi.string().required(),
    avatar: Joi.string().uri(),
    userId: Joi.string().min(20).max(40).required(),

    followingUserIds: Joi.array()
});