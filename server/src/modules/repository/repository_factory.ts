import { Connection, Repository } from "typeorm";

import { User } from "@entity/user";

export class RepositoryFactory {
    constructor(private readonly connection: Connection) {
    }

    get userRepository(): UserRepository {
        return new UserRepository(this.connection.getRepository<User>(User));
    }
}

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