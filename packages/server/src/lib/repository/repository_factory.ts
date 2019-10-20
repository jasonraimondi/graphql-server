import { Connection } from "typeorm";

import { EmailConfirmationRepository } from "@/lib/repository/user/email_confirmation_repository";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { ForgotPasswordRepository } from "@/lib/repository/user/forgot_password_repository";

export class RepositoryFactory {
    constructor(private readonly connection: Connection) {
    }

    get forgotPasswordRepository(): ForgotPasswordRepository {
        return this.connection.getCustomRepository<ForgotPasswordRepository>(ForgotPasswordRepository);
    }

    get userRepository(): UserRepository {
        return this.connection.getCustomRepository<UserRepository>(UserRepository);
    }

    get userConfirmationRepository(): EmailConfirmationRepository {
        return this.connection.getCustomRepository<EmailConfirmationRepository>(EmailConfirmationRepository);
    }
}
