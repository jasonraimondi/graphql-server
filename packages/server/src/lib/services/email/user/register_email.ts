import { inject, injectable } from "inversify";

import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { IMailer } from "@/lib/services/email/mailer";
import { SERVICES } from "@/lib/constants/inversify";

@injectable()
export class RegisterEmail {
    constructor(@inject(SERVICES.Mailer) private readonly emailService: IMailer) {}

    async send(userConfirmation: EmailConfirmation): Promise<any> {
        const user = userConfirmation.user;
        await this.emailService.send({
            to: user.email,
            from: "noreply@example.com",
            subject: `Register user ${user.email}?`,
            text: `
            verifyUserConfirmation(email:"${user.email}", uuid:"${userConfirmation.uuid}")
            `,
            html: `
            <strong>verifyUserConfirmation(email:"${user.email}", uuid:"${userConfirmation.uuid}")</strong>
            `
        });
    }
}
