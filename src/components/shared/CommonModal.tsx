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
import { modalController, OverlayEventDetail } from '@ionic/core';

export class CommonModalProps {
  onCancel: () => Promise<boolean>;
  onConfirm: () => Promise<boolean>;
  triggerId: string;
  title: string;
}

export class CommonModalState {
  public name: string = "";
}

export class CommonModal extends React.Component<CommonModalProps, CommonModalState> {
  
  componentDidMount() {
    this.setState(new CommonModalState());
  }

  onWillDismiss(ev: CustomEvent<OverlayEventDetail<any>>) {
    // TODO: hook that is called before modal is about to be dismissed, like checking to see if data needs saved
  }

  async dismiss() {
    let shouldDismiss = await this.props.onCancel();
    if (shouldDismiss) modalController.dismiss();
  }

  
  async confirm() {
    let shouldConfirm = await this.props.onConfirm();
    if (shouldConfirm) modalController.dismiss();
  }

  render() {
    return (
      <div>
        <IonModal trigger={this.props.triggerId} onWillDismiss={(e) => this.onWillDismiss(e)}>
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
