import { NodemailerService } from "./email/nodemailer_mailer";
import { IMailer } from "./email/mailer";

export class ServiceFactory {
    constructor(private readonly mailerURL: string = "smtp://localhost:1025") {
    }

    get emailService(): IMailer {
        return new NodemailerService(this.mailerURL);
    }
}
