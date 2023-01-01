

import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile';
import { UserProfileComponent } from '../users/UserProfileComponent';

export class DevUserProps {
  public userProfile: UserProfile;
}

export class DevUserState {
  public name: string = "";
}

export class DevUser extends React.Component<DevUserProps, DevUserState> {

  render() {

    return (
      <UserProfileComponent user={this.props.userProfile}>
      </UserProfileComponent>
    )
  }
} 
