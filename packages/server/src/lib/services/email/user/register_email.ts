import { inject, injectable } from "inversify";

import { EmailService } from "@/lib/services/email/email_service";
import { TYPES } from "@/lib/repository/repository_factory";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";

@injectable()
export class RegisterEmail {
    constructor(@inject(TYPES.EmailService) private readonly emailService: EmailService) {}

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
