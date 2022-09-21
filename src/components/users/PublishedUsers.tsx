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

class PublishedUserProps {
}

class PublishedUserState {
  public users: UserProfile[] = []
}

export class PublishedUsers extends React.Component<PublishedUserProps, PublishedUserState> {
  markdownController: MarkdownController = new MarkdownController();
  

  async componentDidMount() {
    let users = await userService.publishedUsers();
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
