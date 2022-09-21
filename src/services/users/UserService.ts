import { UserProfile } from "../../models/UserProfile";
import { IUserService } from "./IUserService";
import { LocalStorageUserService } from "./LocalStorageUserService";

let userService: IUserService;

if (process.env.NODE_ENV == "development") {
    userService = new LocalStorageUserService();

    const userProfile = new UserProfile();
    userProfile.username = 'fourbian';
    userProfile.avatar = '/assets/4bn_profile.png';
    userProfile.userId = '12345678910fourbian12345678910';
    (userService as LocalStorageUserService).setUserProfileDevOnly(userProfile);
    userService.readProfile() // in case user has updated their avatar or username since initialized
        .then(u => {
            userService.updateProfile(u);
        })
} else {
    throw new Error(`No user service defined for ${process.env.NODE_ENV}`);
}

export { userService }