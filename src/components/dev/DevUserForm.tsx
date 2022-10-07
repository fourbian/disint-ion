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
  IonInput
} from '@ionic/react';

import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile';
import { UserProfileComponent } from '../users/UserProfileComponent';

export class DevUserFormProps {
  public userProfile: UserProfile;
}

export class DevUserFormState {
  public name: string = "";
}

export class DevUserForm extends React.Component<DevUserFormProps, DevUserFormState> {

  render() {

    return (
      <UserProfileComponent user={this.props.userProfile}>
      </UserProfileComponent>
    )
  }
} 
