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