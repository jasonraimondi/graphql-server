import { Connection } from "typeorm";

import { User } from "@/entity/user";
import { UserRepository } from "@/modules/repository/user_repository";
import { UserConfirmationRepository } from "@/modules/repository/user_confirmation_repository";
import { UserConfirmation } from "@/entity/user_confirmation";

export const TYPES = {
    AuthResolver: Symbol("AuthResolver"),
    UserRepository: Symbol("UserRepository"),
    EmailService: Symbol("EmailService"),
    ForgotPasswordEmail: Symbol("ForgotPasswordEmail"),
    UserConfirmation: Symbol("UserConfirmation"),

};

export class RepositoryFactory {
    constructor(private readonly connection: Connection) {
    }

    get userRepository(): UserRepository {
        return new UserRepository(this.connection.getRepository<User>(User));
    }

    get userConfirmationRepository(): UserConfirmationRepository {
        return new UserConfirmationRepository(this.connection.getRepository<UserConfirmation>(UserConfirmation));
    }
}
