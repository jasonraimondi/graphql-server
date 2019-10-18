import Mail from "nodemailer/lib/mailer";

import { EmailService } from "@/lib/services/email/email_service";

export class ServiceFactory {
    constructor(private readonly mailer: Mail) {
    }

    get emailService() {
        return new EmailService(this.mailer);
    }
}