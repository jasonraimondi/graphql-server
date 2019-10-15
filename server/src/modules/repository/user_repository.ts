import { injectable } from "@root/node_modules/inversify";
import { Repository } from "@root/node_modules/typeorm";
import { User } from "@/entity/user";

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

    async incrementToken(userId: string): Promise<void> {
        await this.repository.increment({ uuid: userId }, "tokenVersion", 1);
    }
}