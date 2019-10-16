import { inject, injectable } from "inversify";

import { EmailService } from "@/services/email/email_service";
import { TYPES } from "@/modules/repository/repository_factory";
import { UserConfirmation } from "@/entity/user_confirmation";

@injectable()
export class RegisterEmail {
    constructor(@inject(TYPES.EmailService) private readonly emailService: EmailService) {}

    async send(userConfirmation: UserConfirmation): Promise<any> {
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
