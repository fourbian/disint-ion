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

class PublishedUserProps {
}

class PublishedUserState {
  public users: UserProfile[] = []
}

export class PublishedUsers extends React.Component<PublishedUserProps, PublishedUserState> {
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
    let users = await userService.publishedUsers();
    this.setState({ users });
  }

  async toggleFollowUser(user: UserProfile) {
    if (userService.isFollowing(user)) {
      await userService.unFollowUser(user);
    } else {
      await userService.followUser(user);
    }

    await this.updateUserState();
  }

  onFollowUserUpdate(user: UserProfile) {
    if (user?.userId) {
      this.updateUserState();
    }
  }

  render() {
    return <IonList>
      {(this.state?.users || []).map(u =>
        <IonItem button detail={false} key={u.userId}>
          <UserProfileComponent user={u}></UserProfileComponent>
          <PopoverButton>
            <IonItem button onClick={(e) => { this.toggleFollowUser(u); popoverController.dismiss() }} detail={false}>
              {userService.isFollowing(u) ? 'Unfollow' : 'Follow'}
            </IonItem>
          </PopoverButton>

        </IonItem>
      )}
    </IonList>
  }
} 
