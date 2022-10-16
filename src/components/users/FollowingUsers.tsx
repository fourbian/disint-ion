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
import { PopoverButton } from '../shared/PopoverButton';
import { popoverController } from '@ionic/core';
import { Subscription } from 'rxjs';

class FollowingUsersProps {
}

class FollowingUsersState {
  public users: UserProfile[] = []
}

export class FollowingUsers extends React.Component<FollowingUsersProps, FollowingUsersState> {
  unFollowingSubscription: Subscription;
  followingSubscription: Subscription;

  async componentDidMount() {
    await this.updateUserState();
    this.followingSubscription = userService.onFollowing(this.onFollowUserUpdate.bind(this));
    this.unFollowingSubscription = userService.onUnFollowing(this.onFollowUserUpdate.bind(this));
    this.forceUpdate();
  }

  componentWillUnmount() {
    this.unFollowingSubscription.unsubscribe();
    this.followingSubscription.unsubscribe();
  }

  async updateUserState() {
    let users = await userService.followingUsers();
    this.setState({ users });
  }

  onFollowUserUpdate(user: UserProfile) {
    if (user?.userId) {
      this.updateUserState();
    }
  }

  unFollowUser(user: UserProfile) {
    userService.unFollowUser(user);
  }

  render() {
    return <IonList>
      {
        this.state?.users.map(u =>
          <IonItem button detail={false} key={u.userId}>
            <UserProfileComponent user={u}></UserProfileComponent>
            <PopoverButton>
              <IonItem button onClick={(e) => { this.unFollowUser(u); popoverController.dismiss() }} detail={false}>Unfollow</IonItem>
            </PopoverButton>
          </IonItem>
        )
      }
    </IonList>
  }
} 
