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

class FollowingUserProps {
}

class FollowingUserState {
  public users: UserProfile[] = []
}

export class FollowingUsers extends React.Component<FollowingUserProps, FollowingUserState> {
  markdownController: MarkdownController = new MarkdownController();
  

  async componentDidMount() {
    let users = await userService.followingUsers();
    this.setState({users});
    this.forceUpdate();
  }

  render() {
    return <div className="comment-hover" >
      {
        this.state?.users.map(u => 
          <div>
            {u.username}
          </div>
      )}
    </div>
  }
} 
