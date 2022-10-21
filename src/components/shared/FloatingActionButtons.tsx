/* Using with IonPopover Component */

import React, { useState } from 'react';
import { IonPopover, IonButton, IonIcon, IonFab, IonFabButton } from '@ionic/react';
import { ellipsisVerticalOutline, saveOutline, sendOutline } from 'ionicons/icons';
import './FloatingActionButtons.css'
import { Subscription } from 'rxjs';
import { serviceBus } from '../../services/bus/ServiceBus';
import { IServiceBusEvent } from '../../services/bus/IServiceBusEvent';
import { BeginNewCommentEvent } from '../../services/bus/BeginNewCommentEvent';
import { RequestAddCommentEvent } from '../../services/bus/RequestAddCommentEvent';
import { RequestSaveCommentEvent } from '../../services/bus/RequestSaveCommentEvent';
import { EditExistingCommentEvent } from '../../services/bus/EditExistingCommentEvent';

interface FloatingActionButtonProps {
    addId?: string;
    saveId?: string;
}

interface FloatingActionButtonState {
    showAdd: boolean;
    showSave: boolean;
}

export class FloatingActionButtons extends React.Component<FloatingActionButtonProps, FloatingActionButtonState> {
    serviceBusSubscription: Subscription;

    async componentDidMount() {
        this.serviceBusSubscription = serviceBus.subscribe(this.onServiceBusEvent.bind(this));
    }

    componentWillUnmount() {
        if (this.serviceBusSubscription) this.serviceBusSubscription.unsubscribe();
    }

    onServiceBusEvent(serviceBusEvent: IServiceBusEvent) {
        if (serviceBusEvent instanceof BeginNewCommentEvent) {
            let e = serviceBusEvent as BeginNewCommentEvent;
            if (e.id == this.props.addId) {
                this.setState({ showAdd: e.active });
            }
        } else if (serviceBusEvent instanceof EditExistingCommentEvent) {
            let e = serviceBusEvent as EditExistingCommentEvent;
            if (this.props.saveId && e.id == this.props.saveId) {
                this.setState({ showSave: e.active });
            }
        }
        //console.log(typeof serviceBusEvent, serviceBusEvent instanceof FloatingActionButtons);
    }

    onAdd() {
        serviceBus.emit(new RequestAddCommentEvent(this.props.addId || "", true))
    }

    onSave(): void {
        serviceBus.emit(new RequestSaveCommentEvent(this.props.saveId || "", true))
    }

    render() {
        return (
            <>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    {this.state?.showAdd &&
                        <IonFabButton>
                            <IonIcon icon={sendOutline} onClick={() => this.onAdd()} />
                        </IonFabButton>
                    }
                    {this.state?.showSave &&
                        <IonFabButton>
                            <IonIcon icon={saveOutline} onClick={() => this.onSave()} />
                        </IonFabButton>
                    }
                </IonFab>
            </>
        );
    }
};