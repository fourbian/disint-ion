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
  IonButton,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonInput
} from '@ionic/react';

import React, { ChangeEvent, Children } from "react";
import { DisintComment } from "../../models/DisintComment";
import { MarkdownController } from "../markdown/MarkdownController";
import { MarkdownEditor } from "../markdown/MarkdownEditor";
import { userService } from '../../services/users/UserService';
import { UserProfile } from '../../models/UserProfile';
import { UserProfileComponent } from '../users/UserProfileComponent';
import { OverlayEventDetail } from '@ionic/core';

export class CommonModalProps {
  onCancel: () => Promise<boolean>;
  onConfirm: () => Promise<boolean>;
  triggerId?: string;
  title: string;
}

export class CommonModalState {
  public name: string = "";
}

export class CommonModal extends React.Component<CommonModalProps, CommonModalState> {
  public modal: React.RefObject<HTMLIonModalElement>;
  
  constructor(props: CommonModalProps) {
    super(props);
    this.modal = React.createRef();
  }

  componentDidMount() {
    this.setState(new CommonModalState());
  }

  onWillDismiss(ev: CustomEvent<OverlayEventDetail<any>>) {
    // TODO: hook that is called before modal is about to be dismissed, like checking to see if data needs saved
  }

  async dismiss() {
    let shouldDismiss = await this.props.onCancel();
    if (shouldDismiss) this.modal.current?.dismiss();
  }

  
  async confirm() {
    let shouldConfirm = await this.props.onConfirm();
    if (shouldConfirm) this.modal.current?.dismiss();
  }

  public present() {
    this.modal.current?.present();
  }

  render() {
    return (
      <div>
        <IonModal ref={this.modal} trigger={this.props.triggerId} onWillDismiss={(e) => this.onWillDismiss(e)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => this.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>{this.props.title}</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} onClick={() => this.confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            {this.props.children}
          </IonContent>
        </IonModal>
      </div>
    );
  }
}
