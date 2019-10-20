import { NodemailerService } from "@/lib/services/email/nodemailer_mailer";
import { IMailer } from "@/lib/services/email/mailer";

export class ServiceFactory {
    constructor(private readonly mailerURL: string = "smtp://localhost:1025") {
    }

    get emailService(): IMailer {
        return new NodemailerService(this.mailerURL);
    }
}
