import { Connection } from "typeorm";

import { User } from "@/entity/user";
import { UserRepository } from "@/lib/repository/user_repository";
import { UserConfirmationRepository } from "@/lib/repository/user_confirmation_repository";
import { EmailConfirmation } from "@/entity/email_confirmation";
import { ForgotPasswordRepository } from "@/lib/repository/forgot_password_repository";
import { ForgotPassword } from "@/entity/forgot_password";

export const TYPES = {
    AuthResolver: Symbol("AuthResolver"),
    EmailService: Symbol("EmailService"),
    ForgotPasswordEmail: Symbol("ForgotPasswordEmail"),
    RegisterEmail: Symbol("RegisterEmail"),

    UserRepository: Symbol("UserRepository"),
    UserConfirmationRepository: Symbol("UserConfirmationRepository"),
    ForgotPasswordRepository: Symbol("ForgotPasswordRepository"),

};

export class RepositoryFactory {
    constructor(private readonly connection: Connection) {
    }

    get forgotPasswordRepository(): ForgotPasswordRepository {
        return new ForgotPasswordRepository(this.connection.getRepository<ForgotPassword>(ForgotPassword));
    }

    get userRepository(): UserRepository {
        return new UserRepository(this.connection.getRepository<User>(User));
    }

    get userConfirmationRepository(): UserConfirmationRepository {
        return new UserConfirmationRepository(this.connection.getRepository<EmailConfirmation>(EmailConfirmation));
    }
}
