import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { personOutline, archiveOutline, archiveSharp, homeOutline,  bookmarkOutline, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import { CeramicPortal } from '../lib/ceramic/ceramic-portal';
import config from '../config.json'
import { useState } from 'react';
import { DevUsers } from './dev/DevUsers';
import { FollowingUsers } from './users/FollowingUsers';
import { PublishedUsers } from './users/PublishedUsers';


const Menu2: React.FC = () => {
  const location = useLocation();
  const [loginName, setLoginName] = useState("");
  const [loginAddress, setLoginAddress] = useState("");
  let portal = CeramicPortal.getInstance(config.ceramicEndpoints);

  let connectWallet = async () => {
    await portal.authenticate();
    await portal.updateProfile("test name", 'https://avatars.githubusercontent.com/u/1857282?s=64&v=4');
    let data = (await portal.readProfile()) as any;

    setLoginName(data.name);
    setLoginAddress(portal.firstLoginAddress());

  }

  return (
    <IonMenu contentId="main" type="overlay" side="end">
      <IonContent>
      <IonAccordionGroup>
          <IonAccordion value="DevUsers">
            <IonItem slot="header" color="light">
              <IonLabel>Dev - Users</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
            <DevUsers></DevUsers>
            </div>
          </IonAccordion>
          <IonAccordion value="QuickSearch">
            <IonItem slot="header" color="light">
              <IonLabel>Quick Search</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
            Table of Contents
            </div>
          </IonAccordion>
          <IonAccordion value="RelatedItems">
            <IonItem slot="header" color="light">
              <IonLabel>Related Items</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
            Saved Items
            </div>
          </IonAccordion>
          <IonAccordion value="Quality">
            <IonItem slot="header" color="light">
              <IonLabel>Quality</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
            Profile and Settings
            </div>
          </IonAccordion>
          <IonAccordion value="FollowingUsers">
            <IonItem slot="header" color="light">
              <IonLabel>Following Users</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
            <FollowingUsers></FollowingUsers>
            </div>
          </IonAccordion>
          <IonAccordion value="PublishedUsers">
            <IonItem slot="header" color="light">
              <IonLabel>Published Users</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
            <PublishedUsers></PublishedUsers>
            </div>
          </IonAccordion>
          <IonAccordion value="PublishedComments">
            <IonItem slot="header" color="light">
              <IonLabel>Published Comments</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
            Profile and Settings
            </div>
          </IonAccordion>
          <IonAccordion value="Profile">
            <IonItem slot="header" color="light">
              <IonLabel>Profile</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
            Profile
            </div>
          </IonAccordion>
          <IonAccordion value="Settings">
            <IonItem slot="header" color="light">
              <IonLabel>Settings</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
            Settings
            </div>
          </IonAccordion>

        </IonAccordionGroup>

      </IonContent>
    </IonMenu>
  );
};

export default Menu2;
