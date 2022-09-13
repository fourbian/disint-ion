import { UserProfile } from "../../models/UserProfile";
import { IUserService } from "./IUserService";

export class LocalStorageUserService implements IUserService{
    private userProfile: UserProfile;
    private _isAuthenticated: boolean = true;

    // don't use this
    public setUserProfileDevOnly(userProfile: UserProfile) {
        this.userProfile = userProfile;
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
        this.userProfile.avatar = profile.avatar;
        this.userProfile.username = profile.username;

        localStorage.setItem(this.userProfile.userId, JSON.stringify(this.userProfile));

        return this.userProfile;
    }

    async logout() {

    }


}