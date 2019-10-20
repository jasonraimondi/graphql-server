import { NodemailerService } from "@/lib/services/email/nodemailer_mailer";

export class ServiceFactory {
    constructor(private readonly mailerURL: string = "smtp://localhost:1025") {
    }

    get emailService() {
        return new NodemailerService(this.mailerURL);
    }
}
