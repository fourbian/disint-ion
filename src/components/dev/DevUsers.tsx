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
  IonButton,
  ModalOptions
} from '@ionic/react';

import Joi from "joi";
import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { CommonModal } from '../shared/CommonModal';
import { DevUserForm } from './DevUserForm';
import { UserProfile, userProfileSchema } from '../../models/UserProfile';
import { UserProfileComponent } from '../users/UserProfileComponent';
import { modalController } from '@ionic/core';
import { join } from 'path';
import { LocalStorageUserService } from '../../services/users/LocalStorageUserService';
import { FormState } from '../../models/FormState';

export class DevUsersState {
  modalUserProfile: UserProfile = new UserProfile();
  users: UserProfile[] = [];
  modalTitle: string = "";
  modalHasErrors: boolean = false;
}

export class DevUsersProps {
}

export class DevUsers extends React.Component<DevUsersProps, DevUsersState> {
  commonModal: React.RefObject<CommonModal>;


  constructor(props: DevUsersProps) {
    super(props);
    this.commonModal = React.createRef<CommonModal>();
  }

  componentDidMount() {
    userService.publishedUsers().then(users => {
      this.setState({ users });
    });

  }

  async onCancel(): Promise<boolean> {
    return true;
  }

  async onConfirm(): Promise<boolean> {
    if (this.state.modalHasErrors) {
      alert("please fix errors");
      return false;
    } else {
      let localUserService = userService as LocalStorageUserService;
      let userProfile = this.state.modalUserProfile;
      localUserService.setUserProfileDevOnly(userProfile);
      localUserService.readProfile() // in case user has updated their avatar or username since initialized
          .then(u => {
              userService.updateProfile(u);
          })
      return true;
    }
  }

  onEditUser(userProfile: UserProfile) {
    this.setState({
      modalUserProfile: userProfile,
      modalTitle: "Edit " + userProfile.username
    });
    this.commonModal.current?.present();

  }

  onNewUser() {
    this.setState({
      modalUserProfile: new UserProfile(),
      modalTitle: "New user"
    });
    this.commonModal.current?.present();
  }

  onModalStateChange(devUserFormState: FormState<UserProfile>) {
    this.setState({
      modalUserProfile: devUserFormState.form,
      modalHasErrors: !!devUserFormState.errors?.size
    });
  }

  render() {

    return <div>
      <IonButton expand="block" onClick={() => this.onNewUser()}>
        New
      </IonButton>

      {(this.state?.users || []).map(u => {
        return (
          <div className="comment-hover" onClick={(e) => this.onEditUser(u)} key={u.userId}>
            <UserProfileComponent user={u} ></UserProfileComponent>
          </div>
        )
      })}

      <CommonModal ref={this.commonModal} onCancel={() => this.onCancel()} onConfirm={() => this.onConfirm()} title={this.state?.modalTitle}>
        <DevUserForm schema={userProfileSchema} onStateChange={state => this.onModalStateChange(state)} value={this.state?.modalUserProfile}></DevUserForm>
      </CommonModal>
    </div>
  }
} 
