
import React from "react";
import './LazyAvatar.css';
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile'
import { Avatar } from "@chakra-ui/react";

class LazyAvatarProps {
  public userId: string;
}

class LazyAvatarState {
  public user: UserProfile;
}

export class LazyAvatar extends React.Component<LazyAvatarProps, LazyAvatarState> {
  loadUserId: string;

  async loadUser() {
    if (this.props.userId && this.loadUserId != this.props.userId) {
      this.loadUserId = this.props.userId;
      const user = await userService.readProfile(this.loadUserId);
      this.setState({ user });
    }
  }

  render() {
    this.loadUser();
    return this.state?.user && <>
      <Avatar src={this.state?.user?.avatar}>
      </Avatar>
    </> || <span>avatar</span>;
  }
} 
