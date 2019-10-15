import { Connection } from "typeorm";

import { User } from "@/entity/user";
import { UserRepository } from "@/modules/repository/user_repository";

export const TYPES = {
    AuthResolver: Symbol("AuthResolver"),
    UserRepository: Symbol("UserRepository"),
};

export class RepositoryFactory {
    constructor(private readonly connection: Connection) {
    }

    get userRepository(): UserRepository {
        return new UserRepository(this.connection.getRepository<User>(User));
    }
}
