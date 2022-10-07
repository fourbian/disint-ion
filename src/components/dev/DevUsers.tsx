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

export class DevUsersState {
  public name: string = "";
}
export class DevUsersProps {
}

export class DevUsers extends React.Component<DevUsersProps, DevUsersState> {

  onInput(e: CustomEvent<InputEvent>) {
    const el = e.target as HTMLInputElement;
    this.setState({
      [el.name] : el.value
    } as any);  
  }

  async onCancel(): Promise<boolean> {
    alert("cancel " + JSON.stringify(this.state));
    return true;
  }

  async onConfirm() : Promise<boolean> {
    alert("confirm " + JSON.stringify(this.state));
    return true;
  }


  render() {

    return <div className="comment-hover" >
      <IonButton id="modal12345" expand="block">
        Openn
      </IonButton>

      <CommonModal triggerId="modal12345" onCancel={() => this.onCancel()} onConfirm={() => this.onConfirm()} title="Heyo">

        {/*TODO: move this to DevUserForm component */}
        <IonItem>
          <IonLabel position="stacked">Enter your name</IonLabel>
          <IonInput type="text" placeholder="Your name" name="name" value={this.state?.name} onIonInput={e => this.onInput(e)} />
        </IonItem>

      </CommonModal>
    </div>
  }
} 
