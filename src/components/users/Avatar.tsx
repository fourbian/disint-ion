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

class AvatarProps {
  public url: string = "";
}

class AvatarState {
}

export class Avatar extends React.Component<AvatarProps, AvatarState> {
  
  render() {
    return (
      <div>
        { this.props.url &&
            <img src={this.props.url}></img>
        }
      </div>
    )
  }
} 
