import { inject, injectable } from "inversify";

import { ForgotPassword } from "@/entity/forgot_password_entity";
import { IMailer } from "@/lib/services/email/mailer";
import { SERVICES } from "@/lib/constants/inversify";

@injectable()
export class ForgotPasswordEmail {
    constructor(@inject(SERVICES.Mailer) private readonly mailer: IMailer) {}


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
        await this.mailer.send({
            to: user.email,
            from: "noreply@example.com",
            subject: `Forgot your password${user.firstName ? " "+user.firstName : null }?`,
            text,
            html,
        });
    }
}
