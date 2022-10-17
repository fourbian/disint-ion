import { BehaviorSubject, Observable, Subject, Subscription } from "rxjs";
import { UserProfile } from "../../models/UserProfile";
import { IUserService } from "./IUserService";

export class LocalStorageUserService implements IUserService {
    private userProfile: UserProfile;
    private _isAuthenticated: boolean = true;
    private users: UserProfile[] = this.load();
    private followingSubject = new Subject<UserProfile>();
    private unFollowingSubject = new Subject<UserProfile>();

    private load(): UserProfile[] {
        const dbString = localStorage.getItem('disint.db.users');
        const users = dbString ? JSON.parse(dbString as string) : [];
        return users.map((u: any) => new UserProfile(u));
    }

    //
    // DEV ONLY
    //
    // don't use this except Dev only
    public setUserProfileDevOnly(userProfile: UserProfile) {
        this.userProfile = userProfile;
        window.localStorage.setItem("loggedInUserId", this.userProfile.userId);
    }
    public getLoggedInUser(): UserProfile {
        const userId = window.localStorage.getItem("loggedInUserId");
        return this.users.filter(u => u.userId == userId)[0];
    }
    // END DEV ONLY

    public async publishedUsers(): Promise<UserProfile[]> {
        return this.load();
    }

    public async followingUsers(): Promise<UserProfile[]> {
        const followingUserIds = this.userProfile.followingUserIds || [];
        return this.load().filter(u => followingUserIds.includes(u.userId));
    }

    isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    async authenticate(): Promise<UserProfile> {
        this._isAuthenticated = true;
        return this.userProfile;
    }

    async readProfile(): Promise<UserProfile> {
        const profileString = localStorage.getItem(this.userProfile.userId);
        if (profileString) {
            const profile = JSON.parse(profileString);
            this.userProfile = new UserProfile();
            this.userProfile.userId = profile.userId;
            this.userProfile.username = profile.username;
            this.userProfile.avatar = profile.avatar;
        }

        return this.userProfile;
    }

    async updateProfile(profile: UserProfile): Promise<UserProfile> {

        this.users = this.load();

        this.userProfile.avatar = profile.avatar;
        this.userProfile.username = profile.username;

        let user = this.users.filter(u => u.userId == this.userProfile.userId)[0];
        if (user) {
            Object.assign(user, this.userProfile);
        } else {
            this.users.push(this.userProfile)
        }

        localStorage.setItem('disint.db.users', JSON.stringify(this.users));

        return this.userProfile;
    }

    async logout() {

    }

    async followUser(user: UserProfile): Promise<UserProfile | null> {
        if (!this.isFollowing(user)) {
            this.userProfile.followingUserIds.push(user.userId);
            this.updateProfile(this.userProfile);
            this.followingSubject.next(user);
            return user;
        } else {
            return null;
        }
    }

    async unFollowUser(user: UserProfile): Promise<UserProfile | null> {
        if (this.isFollowing(user)) {
            this.userProfile.followingUserIds = this.userProfile.followingUserIds.filter(userId => user.userId != userId);
            this.updateProfile(this.userProfile);
            this.unFollowingSubject.next(user);
            return user;
        } else {
            return null
        }
    }

    isFollowing(u: UserProfile): boolean {
        return this.userProfile?.followingUserIds?.includes(u.userId);
    }

    onFollowing(callback: (user: UserProfile) => void): Subscription {
        return this.followingSubject.subscribe(callback);
    }
    onUnFollowing(callback: (user: UserProfile) => void): Subscription {
        return this.unFollowingSubject.subscribe(callback);
    }

}