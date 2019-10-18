import { injectable } from "inversify";
import Mail from "nodemailer/lib/mailer";

import { Options } from "@/lib/services/email/mailer";
import { SentMessageInfo } from "nodemailer";

@injectable()
export class EmailService {
    constructor(private readonly transporter: Mail) {
    }

    async send(options: Options): Promise<SentMessageInfo> {
        return await this.transporter.sendMail(options);
    }
}
