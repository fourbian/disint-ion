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
  IonButton
} from '@ionic/react';

import React from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { CommonModal } from '../shared/CommonModal';
import { DevUserForm } from './DevUserForm';
import { DevUserModel } from '../../models/DevUserModel';
import { UserProfile } from '../../models/UserProfile';
import { UserProfileComponent } from '../users/UserProfileComponent';

export class DevUsersState {
  devUserModalModel: DevUserModel = new DevUserModel();
  users: UserProfile[] = [];
}

export class DevUsersProps {
}

export class DevUsers extends React.Component<DevUsersProps, DevUsersState> {


  componentDidMount() {
    userService.publishedUsers().then(users => {
      this.setState({ users });
    });
    
  }

  async onCancel(): Promise<boolean> {
    alert("cancel " + JSON.stringify(this.state));
    return true;
  }

  async onConfirm() : Promise<boolean> {
    alert("confirm " + JSON.stringify(this.state));
    return true;
  }

  onModalStateChange(devUserModel: DevUserModel) {
    this.setState({ devUserModalModel : devUserModel });
  }

  render() {

    return <div className="comment-hover" >
      <IonButton id="modal12345" expand="block">
        New
      </IonButton>

      {(this.state?.users || []).map(u => {
        return <UserProfileComponent user={u} key={u.userId}></UserProfileComponent>
      })}

      <CommonModal triggerId="modal12345" onCancel={() => this.onCancel()} onConfirm={() => this.onConfirm()} title="Heyo">
        <DevUserForm onStateChange={state => this.onModalStateChange(state)} value={this.state?.devUserModalModel}></DevUserForm>
      </CommonModal>
    </div>
  }
} 
