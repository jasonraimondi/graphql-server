import Mail from "nodemailer/lib/mailer";

export interface Options extends Mail.Options {}

export interface Mailer {
    send(options: Options): Promise<any>;
}
