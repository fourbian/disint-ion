export class DevUserModel {
    constructor(obj: any = null) {
        Object.assign(this, obj || {});
    }

    name: string;
}