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
  ModalOptions,
  IonSelect,
  IonSelectOption
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
import { PopoverButton } from '../shared/PopoverButton';
import { popoverController } from '@ionic/core';
import { star } from 'ionicons/icons';

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
    this.updateUserState();
  }

  updateUserState() {
    userService.publishedUsers().then(users => {
      this.setState({ users });
    });
  }

  async onModalCancelUser(): Promise<boolean> {
    return true;
  }

  async onModalConfirmUser(): Promise<boolean> {
    if (this.state.modalHasErrors) {
      alert("please fix errors");
      return false;
    } else {
      let currentUserProfile = (userService as LocalStorageUserService).getLoggedInUser();
      await (userService as LocalStorageUserService).setUserProfileDevOnly(this.state.modalUserProfile); // memory only
      await userService.updateProfile(this.state.modalUserProfile); // commit to storage
      // reset to logged in user
      await (userService as LocalStorageUserService).setUserProfileDevOnly(currentUserProfile);
      this.updateUserState();
      return true;
    }
  }

  onEditUserModal(userProfile: UserProfile) {
    this.setState({
      modalUserProfile: userProfile,
      modalTitle: "Edit " + userProfile.username
    });
    this.commonModal.current?.present();

  }

  onNewUserModal() {
    this.setState({
      modalUserProfile: new UserProfile(),
      modalTitle: "New user"
    });
    this.commonModal.current?.present();
  }

  onModalUserFormStateChange(devUserFormState: FormState<UserProfile>) {
    this.setState({
      modalUserProfile: devUserFormState.form,
      modalHasErrors: !!devUserFormState.errors?.size
    });
  }

  login(user: UserProfile) {
    let localUserService = userService as LocalStorageUserService;
    localUserService.setUserProfileDevOnly(user);
    window.location.reload();
  }

  render() {

    return <div>
      <IonButton expand="block" onClick={() => this.onNewUserModal()}>
        New
      </IonButton>

      <IonList>
        {(this.state?.users || []).map(u => {
          return (
            // detail='false' to remove the right arrow for iOS devices
            <IonItem button detail={false} key={u.userId}>
              <UserProfileComponent user={u} onClick={(e) => this.onEditUserModal(u)}></UserProfileComponent>
              <PopoverButton>
                <IonItem button onClick={(e) => { this.login(u); popoverController.dismiss() }} detail={false}>Login</IonItem>
              </PopoverButton>
            </IonItem>
          )
        })}
      </IonList>

      <CommonModal ref={this.commonModal} onCancel={() => this.onModalCancelUser()} onConfirm={() => this.onModalConfirmUser()} title={this.state?.modalTitle}>
        <DevUserForm schema={userProfileSchema} onStateChange={state => this.onModalUserFormStateChange(state)} value={this.state?.modalUserProfile}></DevUserForm>
      </CommonModal>
    </div>
  }
} 
