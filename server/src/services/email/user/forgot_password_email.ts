import { inject, injectable } from "inversify";

import { EmailService } from "@/services/email/email_service";
import { TYPES } from "@/modules/repository/repository_factory";

@injectable()
export class ForgotPasswordEmail {
    constructor(@inject(TYPES.EmailService) private readonly emailService: EmailService) {}

    async send(to: string): Promise<any> {
        await this.emailService.send({
            to,
            from: "noreply@example.com",
            subject: `Forgot your password ${to}?`,
            text: `I'll help you find a new one ${to}`,
            html: `<strong>I'll Help you find a new one. ${to}</strong>`
        });
    }
}
