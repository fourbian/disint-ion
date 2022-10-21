import { Subject } from "rxjs";
import { Subscription } from "rxjs/internal/Subscription";
import { IServiceBusEvent } from "./IServiceBusEvent";

export class ServiceBus {
    private _serviceBusSubject = new Subject<IServiceBusEvent>();

    subscribe(callback: (serviceBusEvent: IServiceBusEvent) => void): Subscription {
        return this._serviceBusSubject.subscribe(callback);
    }

    emit(serviceBusEvent: IServiceBusEvent) {
        this._serviceBusSubject.next(serviceBusEvent);
    }

    emitBeginNewComment() {

    }

    emitEditExistingComment() {

    }

    emitRequestCreateComment() {

    }

    emitRequestSaveComment() {

    }
}

export let serviceBus: ServiceBus = new ServiceBus();