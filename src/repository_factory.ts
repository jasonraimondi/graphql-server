import { Connection, Repository } from "typeorm";
import { User } from "@entity/user";

export class RepositoryFactory {
    constructor(private readonly connection: Connection) {
    }

    get userRepository(): Repository<User> {
        return this.connection.getRepository<User>(User);
    }
}