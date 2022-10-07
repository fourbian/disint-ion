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
import { DevUserModel } from '../../models/DevUserModel';

export class DevUserFormProps {
  public onStateChange: (devUserModel: DevUserModel) => void;
  public value: DevUserModel = new DevUserModel();
}

export class DevUserForm extends React.Component<DevUserFormProps, DevUserModel> {

  componentDidMount() {
    this.setStateHelper(this.props.value);
  }

  setStateHelper(state: any) {
    let newState = Object.assign({}, this.state, state);
    this.setState(newState);
    this.props.onStateChange(newState);
  }

  onInput(e: CustomEvent<InputEvent>) {
    const el = e.target as HTMLInputElement;
    this.setStateHelper({
      [el.name] : el.value
    } as any);  
  }

  render() {

    return (
      <IonItem>
        <IonLabel position="stacked">Enter your name</IonLabel>
        <IonInput type="text" placeholder="Your name" name="name" value={this.state?.name} onIonInput={e => this.onInput(e)} />
      </IonItem>
    )
  }
} 
