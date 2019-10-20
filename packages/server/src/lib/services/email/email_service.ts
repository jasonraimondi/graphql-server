import { injectable } from "inversify";
import Mail from "nodemailer/lib/mailer";

import { IMailer, Options } from "@/lib/services/email/mailer";

@injectable()
export class NodemailerService implements IMailer {
    constructor(private readonly transporter: Mail) {
    }

    async send(options: Options) {
        return await this.transporter.sendMail(options);
    }
}
