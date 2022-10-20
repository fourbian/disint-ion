import { Subscription } from "rxjs";
import { UserProfile } from "../../models/UserProfile";

export interface IUserService {
    onFollowing(callback: (user: UserProfile) => void): Subscription;
    onUnFollowing(callback: (user: UserProfile) => void): Subscription;
    isFollowing(u: UserProfile): boolean;
    followUser(user: UserProfile): Promise<UserProfile | null>;
    unFollowUser(user: UserProfile): Promise<UserProfile | null>;
    isAuthenticated(): boolean;
    authenticate(): Promise<UserProfile>;
    readCurrentUserProfile(): Promise<UserProfile>;
    readProfile(userId: string): Promise<UserProfile>;
    updateProfile(profile: UserProfile): Promise<UserProfile>;
    publishedUsers(): Promise<UserProfile[]>;
    followingUsers(): Promise<UserProfile[]>;

}