import { Connection } from "typeorm";

import {
    EmailConfirmationRepository,
    IEmailConfirmationRepository
} from "./user/email_confirmation_repository";
import { IUserRepository, UserRepository } from "./user/user_repository";
import { ForgotPasswordRepository, IForgotPasswordRepository } from "./user/forgot_password_repository";

export class RepositoryFactory {
    constructor(private readonly connection: Connection) {
    }

    get forgotPassword(): IForgotPasswordRepository {
        return this.connection.getCustomRepository<ForgotPasswordRepository>(ForgotPasswordRepository);
    }

    get user(): IUserRepository {
        return this.connection.getCustomRepository<UserRepository>(UserRepository);
    }

    get emailConfirmation(): IEmailConfirmationRepository {
        return this.connection.getCustomRepository<EmailConfirmationRepository>(EmailConfirmationRepository);
    }
}
