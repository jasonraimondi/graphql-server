import Mail from "nodemailer/lib/mailer";
import { injectable } from "@root/node_modules/inversify";

@injectable()
export class EmailService {
    constructor(private readonly transporter: Mail) {
    }

    async send(options: Mail.Options) {
        const response = await this.transporter.sendMail(options);
        console.log(response);
    }
}
