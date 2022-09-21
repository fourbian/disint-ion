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

export class DevUsers extends React.Component<{  }> {
  markdownController: MarkdownController = new MarkdownController();
  

  render() {

    return <div className="comment-hover" >

      Manage users here
    </div>
  }
} 
