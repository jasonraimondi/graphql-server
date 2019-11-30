import v4 from "uuid/v4";

export abstract class BaseUuidEntity {
    uuid: string;

    protected constructor(uuid?: string) {
        if (!uuid) uuid = v4();
        this.uuid = uuid;
    }
}
