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
  IonInput,
  IonAvatar
} from '@ionic/react';

import Joi from 'joi';
import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile';
import { UserProfileComponent } from '../users/UserProfileComponent';
import { FormState } from '../../models/FormState';

export class DevUserFormProps {
  public onStateChange: (devUserFormState: DevUserFormState) => void;
  public value: UserProfile = new UserProfile();
  public schema: Joi.ObjectSchema<UserProfile>;
}

export class DevUserFormState extends FormState {
  public userProfile: UserProfile = new UserProfile();
}

export class DevUserForm extends React.Component<DevUserFormProps, DevUserFormState> {

  componentDidMount() {
    this.setStateHelper({ userProfile: this.props.value, validation: undefined as any });
  }

  setStateHelper(state: DevUserFormState) {
    let newState = Object.assign(new DevUserFormState(), this.state, state);
    let { error, value } = this.props.schema.validate(state.userProfile, { abortEarly: false });
    if (value) {
      newState.userProfile = value;
      newState.validation = error;
      // TODO: make this an extension/helper somewhere, maybe a helper class that DevUserFormState can inherit from that
      // also has validation and errors attributes?
      newState.errors = FormState.KeyValuErrors(error as any);
    }

    this.setState(newState);
    this.props.onStateChange(newState);
  }

  onInput(e: CustomEvent<InputEvent>) {
    const el = e.target as HTMLInputElement;
    const newUserProfile = new UserProfile(this.state?.userProfile);
    (newUserProfile as any)[el.name] = el.value;
    if (el.name == "username") {
      newUserProfile.avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(el.value)}`
    }
    this.setStateHelper({ userProfile: newUserProfile, validation: undefined });
  }

  render() {

    let errorItem = null;
    let hasErrors = !!this.state?.errors?.size;
    let errors = this.state?.errors || new Map<string, string>();
    if (hasErrors) {
      errorItem = <IonItem className={this.state?.errors?.size ? "ion-invalid" : ""}>
        <IonLabel>{this.state?.validation?.message}</IonLabel>
        <span slot="error">{this.state?.validation?.message}</span>
      </IonItem>;
    }
    
    return (
      <IonList>
        {errorItem}
        <IonItem className={errors.get('userId') ? "ion-invalid" : ""}>
          <IonLabel position="stacked">Enter your id</IonLabel>
          <IonInput type="text" placeholder="Id" name="userId" value={this.state?.userProfile?.userId} onIonInput={e => this.onInput(e)} />
          <span slot="error">{errors.get('userId')}</span>
        </IonItem >
        <IonItem className={errors.get('username') ? "ion-invalid" : ""}>
          <IonLabel position="stacked">Enter your username</IonLabel>
          <IonInput type="text" placeholder="Username" name="username" value={this.state?.userProfile?.username} onIonInput={e => this.onInput(e)} />
          <span slot="error">{errors.get('username')}</span>
        </IonItem>
        <IonItem className={errors.get('avatar') ? "ion-invalid" : ""}>
          <IonAvatar slot="start">
            <img src={this.state?.userProfile?.avatar} />
          </IonAvatar>
          <IonLabel position="stacked">Enter your avatar</IonLabel>
          <IonInput type="text" placeholder="Avatar" name="avatar" value={this.state?.userProfile?.avatar} onIonInput={e => this.onInput(e)} />
          <span slot="error">{errors.get('avatar')}</span>
        </IonItem>
      </IonList>
    )
  }
} 
