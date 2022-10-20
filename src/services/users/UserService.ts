import { UserProfile } from "../../models/UserProfile";
import { IUserService } from "./IUserService";
import { LocalStorageUserService } from "./LocalStorageUserService";

let userService: IUserService;

if (process.env.NODE_ENV == "development") {
    userService = new LocalStorageUserService();

    let userProfile = (userService as LocalStorageUserService).getLoggedInUser();
    if (userProfile) {
        (userService as LocalStorageUserService).setUserProfileDevOnly(userProfile);
    } else {
        userProfile = new UserProfile();
        userProfile.username = 'fourbian';
        userProfile.avatar = '/assets/4bn_profile.png';
        userProfile.userId = '12345678910fourbian12345678910';
        (userService as LocalStorageUserService).setUserProfileDevOnly(userProfile);
        userService.readCurrentUserProfile() // in case user has updated their avatar or username since initialized
            .then(async u => {
                await userService.updateProfile(u);
                window.location.reload(); // any better way to re-render more gracefully?
            })
    }

} else {
    throw new Error(`No user service defined for ${process.env.NODE_ENV}`);
}

export { userService }