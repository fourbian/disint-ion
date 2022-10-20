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
import './LazyAvatar.css';
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile'

class LazyAvatarProps {
  public userId: string;
}

class LazyAvatarState {
  public user: UserProfile;
}

export class LazyAvatar extends React.Component<LazyAvatarProps, LazyAvatarState> {

  async componentDidMount() {
    const user = await userService.readProfile(this.props.userId);
    this.setState({ user });
  }

  render() {
    return this.state?.user && <>
      <IonAvatar slot="start" style={{ marginBottom: 'auto', marginTop: '2px' }}>
        <img src={this.state?.user?.avatar} />
      </IonAvatar>
    </> || null;
  }
} 
