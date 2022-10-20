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
  IonAccordion,
  IonAvatar
} from '@ionic/react';

import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile'
import { LazyAvatar } from './LazyAvatar';

class UserProfileProps {
  public user: UserProfile = new UserProfile();
  public onClick? = (e: React.MouseEvent) => { };
}

class UserProfileState {
}

export class UserProfileComponent extends React.Component<UserProfileProps, UserProfileState> {

  render() {
    return (
      <>
        <IonAvatar slot="start" onClick={(e) => this.props.onClick && this.props.onClick(e)}>
          <img src={this.props.user.avatar} />
        </IonAvatar>
        <IonLabel onClick={(e) => this.props.onClick && this.props.onClick(e)}>
          {this.props.user.username}
        </IonLabel>

      </>
    )
  }
} 
