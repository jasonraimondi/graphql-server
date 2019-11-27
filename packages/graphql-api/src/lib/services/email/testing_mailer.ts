import { injectable } from "inversify";

import { IMailer, Options } from "./mailer";

@injectable()
export class TestingMailer implements IMailer {
    async send(_options: Options) {
        return true;
    }
}
