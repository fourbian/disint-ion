import { IServiceBusEvent } from "./IServiceBusEvent";

export class RequestSaveCommentEvent implements IServiceBusEvent {
    constructor(private _id: string, private _active: boolean) {

    }

    get active(): boolean {
        return this._active;
    }

    get id(): string {
        return this._id;
    }

}