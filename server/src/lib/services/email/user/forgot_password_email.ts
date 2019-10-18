import { inject, injectable } from "inversify";

import { EmailService } from "@/lib/services/email/email_service";
import { TYPES } from "@/lib/repository/repository_factory";
import { ForgotPassword } from "@/entity/forgot_password";

@injectable()
export class ForgotPasswordEmail {
    constructor(@inject(TYPES.EmailService) private readonly emailService: EmailService) {}


    async send(forgotPassword: ForgotPassword): Promise<any> {
        const { uuid, user } = forgotPassword;
        const text = `
            I'll help you find a new ${uuid} ${user.email} ${forgotPassword.expiresAt(forgotPassword)}}
        `;
        const html = `
<div>
    <p>Forgot your password?</p>
    <p>I'll Help you find a new one ${uuid} ${user.email} ${forgotPassword.expiresAt(forgotPassword)}</p>
</div>
        `;
        await this.emailService.send({
            to: user.email,
            from: "noreply@example.com",
            subject: `Forgot your password${user.firstName ? ' '+user.firstName : null }?`,
            text,
            html,
        });
    }
}
