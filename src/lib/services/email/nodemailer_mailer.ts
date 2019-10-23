import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import { injectable } from "inversify";

import { IMailer, Options } from "@/lib/services/email/mailer";

@injectable()
export class NodemailerService implements IMailer {
    private readonly transporter: Mail;

    constructor(mailerURL: string) {
        this.transporter = nodemailer.createTransport(mailerURL);
    }

    async send(options: Options) {
        return await this.transporter.sendMail(options).catch(() => { throw new Error("mailer error"); });
    }
}
