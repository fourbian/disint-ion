/* Using with IonPopover Component */

import React, { useState } from 'react';
import { IonPopover, IonButton, IonIcon } from '@ionic/react';
import { ellipsisVerticalOutline } from 'ionicons/icons';

interface PopoverButtonProps {
    icon?: string;
    label?: string;
}

export const PopoverButton: React.FC<React.PropsWithChildren<PopoverButtonProps>> = (props) => {
    const [popoverState, setShowPopover] = useState({
        showPopover: false,
        event: undefined,
    });

    let iconEl = null;
    let iconString = props.icon;
    if (!props.label && !props.icon) {
        iconString = ellipsisVerticalOutline;
    }
    if (iconString) {
        if (props.label) {
            iconEl = <IonIcon slot="start" icon={iconString}></IonIcon>
        } else {
            iconEl = <IonIcon slot="icon-only" icon={iconString}></IonIcon>
        }
    }

    return (
        <>
            <IonPopover
                event={popoverState.event}
                isOpen={popoverState.showPopover}
                onDidDismiss={() => setShowPopover({ showPopover: false, event: undefined })}
            >
                {props.children}
            </IonPopover>
            <IonButton fill='clear'
                onClick={(e: any) => {
                    e.persist();
                    setShowPopover({ showPopover: true, event: e });
                }}
            >
                {iconEl}
                {props.label}
            </IonButton>
        </>
    );
};