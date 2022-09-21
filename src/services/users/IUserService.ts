import { UserProfile } from "../../models/UserProfile";

export interface IUserService {
    isAuthenticated(): boolean;
    authenticate(): Promise<UserProfile>;
    readProfile(): Promise<UserProfile>;
    updateProfile(profile: UserProfile): Promise<UserProfile>;
    publishedUsers() : Promise<UserProfile[]>;
    followingUsers() : Promise<UserProfile[]>;

}