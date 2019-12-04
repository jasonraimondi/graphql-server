import { inject, injectable } from "inversify";

import { IMailer } from "@/lib/services/email/mailer";
import { SERVICE } from "@/lib/constants/inversify";
import { EmailConfirmation } from "@/entity/user/email_confirmation_entity";

@injectable()
export class RegisterEmail {
  constructor(@inject(SERVICE.Mailer) private readonly emailService: IMailer) {}

  async send(userConfirmation: EmailConfirmation): Promise<any> {
    const user = userConfirmation.user;
    const url = `http://localhost:3000/verify_email?e=${user.email}&u=${userConfirmation.uuid}`;
    await this.emailService.send({
      to: user.email,
      from: "noreply@example.com",
      subject: `Register user ${user.email}?`,
      text: url,
      html: `
            <a href="${url}">${url}</a>
            verifyUserConfirmation(email:"${user.email}", uuid:"${userConfirmation.uuid}")
            `,
    });
  }
}
