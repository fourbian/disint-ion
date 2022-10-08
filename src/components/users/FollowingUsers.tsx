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
import { UserProfile } from '../../models/UserProfile';
import { UserProfileComponent } from './UserProfileComponent';

class FollowingUsersProps {
}

class FollowingUsersState {
  public users: UserProfile[] = []
}

export class FollowingUsers extends React.Component<FollowingUsersProps, FollowingUsersState> {
  

  async componentDidMount() {
    let users = await userService.followingUsers();
    this.setState({users});
    this.forceUpdate();
  }

  render() {
    return <div>
      {
        this.state?.users.map(u => 
          <UserProfileComponent user={u}></UserProfileComponent>
      )}
    </div>
  }
} 