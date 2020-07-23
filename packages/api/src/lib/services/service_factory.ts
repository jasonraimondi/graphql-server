import { IMailer } from "@/lib/services/email/mailer";
import { NodemailerService } from "@/lib/services/email/nodemailer_mailer";
import { ExpressOAuthServer } from "@/lib/express_oauth_server";

export class ServiceFactory {
  constructor(private readonly mailerURL: string) {
  }

  get emailService(): IMailer {
    return new NodemailerService(this.mailerURL);
  }

  get oauthService(): ExpressOAuthServer {
    return new ExpressOAuthServer({
      model: require("@/model"),
      // grants: ["authorization_code", "refresh_token"],
    });
  }
}
