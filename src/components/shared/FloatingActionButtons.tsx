/* Using with IonPopover Component */

import React, { useState } from 'react';
import './FloatingActionButtons.css'
import { Subscription } from 'rxjs';
import { serviceBus } from '../../services/bus/ServiceBus';
import { IServiceBusEvent } from '../../services/bus/IServiceBusEvent';
import { BeginNewCommentEvent } from '../../services/bus/BeginNewCommentEvent';
import { RequestAddCommentEvent } from '../../services/bus/RequestAddCommentEvent';
import { RequestSaveCommentEvent } from '../../services/bus/RequestSaveCommentEvent';
import { EditExistingCommentEvent } from '../../services/bus/EditExistingCommentEvent';
import { BeginDndEvent } from '../../services/bus/BeginDndEvent';
import { Droppable } from '../../services/dnd/Droppable';
import { Box, IconButton } from '@chakra-ui/react';
import { MdSave, MdSend } from 'react-icons/md';

interface FloatingActionButtonProps {
    addId?: string;
    saveId?: string;
}

interface FloatingActionButtonState {
    showAdd: boolean;
    showSave: boolean;
    showCancelDnd: boolean;
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
        } else if (serviceBusEvent instanceof BeginDndEvent) {
            let e = serviceBusEvent as BeginDndEvent;
            this.setState({ showCancelDnd: e.active });
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
                <Box
                    position='fixed'
                    bottom='20px'
                    right={['16px', '84px']}
                    zIndex={3}>
                    {this.state?.showAdd &&
                        <IconButton as={MdSend} onClick={() => this.onAdd()} aria-label={'Add'} />
                    }
                    {this.state?.showSave &&
                        <IconButton as={MdSave} onClick={() => this.onSave()} aria-label={'Save'} />
                    }
                </Box>
            </>
        );
    }
};