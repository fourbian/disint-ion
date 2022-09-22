import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
  IonAccordionGroup,
  IonAccordion
} from '@ionic/react';

import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile'
import { Avatar } from './Avatar';

class UserProfileProps {
  public user: UserProfile = new UserProfile();
}

class UserProfileState {
}

export class UserProfileComponent extends React.Component<UserProfileProps, UserProfileState> {
  
  render() {
    return (
      <div>
        <Avatar url={this.props.user.avatar}>

        </Avatar>
        <div>
          {this.props.user.username}
        </div>

      </div>
    )
  }
} 
