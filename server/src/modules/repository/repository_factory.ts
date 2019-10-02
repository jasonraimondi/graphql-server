import { Connection, Repository } from "typeorm";

import { User } from "@entity/user";
import { injectable } from "inversify";


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

@injectable()
export class UserRepository {
    constructor(private readonly repository: Repository<User>) {
    }

    findById(uuid: string): Promise<User> {
        return this.repository.findOneOrFail({ where: { uuid } });
    }

    findByEmail(email: string): Promise<User> {
        return this.repository.findOneOrFail({ where: { email } });
    }

    find(): Promise<User[]> {
        return this.repository.find();
    }
}