
import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile'
import { LazyAvatar } from './LazyAvatar';
import { Avatar, Text } from "@chakra-ui/react";

class UserProfileProps {
  public user: UserProfile = new UserProfile();
  public onClick?= (e: React.MouseEvent) => { };
}

class UserProfileState {
}

export class UserProfileComponent extends React.Component<UserProfileProps, UserProfileState> {

  render() {
    return (
      <>
        <Avatar src={this.props.user.avatar} onClick={(e) => this.props.onClick && this.props.onClick(e)}>
        </Avatar>
        <Text onClick={(e) => this.props.onClick && this.props.onClick(e)}>
          {this.props.user.username}
        </Text>

      </>
    )
  }
} 
