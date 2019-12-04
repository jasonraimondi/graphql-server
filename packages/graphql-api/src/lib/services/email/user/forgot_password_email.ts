import { inject, injectable } from "inversify";

import { IMailer } from "@/lib/services/email/mailer";
import { SERVICE } from "@/lib/constants/inversify";
import { ForgotPassword } from "@/entity/user/forgot_password_entity";

@injectable()
export class ForgotPasswordEmail {
  constructor(@inject(SERVICE.Mailer) private readonly mailer: IMailer) {}

  async send(forgotPassword: ForgotPassword): Promise<any> {
    const { uuid, user } = forgotPassword;
    const url = `http://localhost:3000/reset_password?e=${user.email}&u=${uuid}`;
    const text = `
            Here is the url: ${url}
        `;
    const html = `
            <div>
                <p>Forgot your password?</p>
                <p>I'll Help you find a new one ${uuid} ${user.email} ${forgotPassword.expiresAt}</p>
                <a href="${url}">${url}</a>
            </div>
        `;
    await this.mailer.send({
      to: user.email,
      from: "noreply@example.com",
      subject: `Forgot your password${user.firstName ? " " + user.firstName : null}?`,
      text,
      html,
    });
  }
}
