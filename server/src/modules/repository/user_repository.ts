import { injectable } from "inversify";
import { Repository } from "typeorm";
import { User } from "@/entity/user";
import { BaseRepository } from "@/modules/repository/base_repository";

@injectable()
export class UserRepository extends BaseRepository<User> {
    constructor(repository: Repository<User>) {
        super(repository)
    }

    findByEmail(email: string): Promise<User> {
        return this.repository.findOneOrFail({ where: { email } });
    }

    async incrementToken(userId: string): Promise<void> {
        await this.repository.increment({ uuid: userId }, "tokenVersion", 1);
    }
}