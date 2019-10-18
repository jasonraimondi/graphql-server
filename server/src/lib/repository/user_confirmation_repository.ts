import { injectable } from "inversify";
import { Repository } from "typeorm";

import { BaseRepository } from "@/lib/repository/base_repository";
import { UserConfirmation } from "@/entity/user_confirmation";

@injectable()
export class UserConfirmationRepository extends BaseRepository<UserConfirmation> {
    constructor(repository: Repository<UserConfirmation>) {
        super(repository);
    }

    findByEmail(email: string): Promise<UserConfirmation> {
        return this.repository.findOneOrFail({
            join: {
                alias: "user_confirmation",
                leftJoinAndSelect: {
                    user: "user_confirmation.user",
                }
            },
            where: {
                "user.email = :email": {
                    email
                }
            }
        });
    }

    findById(uuid: string): Promise<UserConfirmation> {
        return this.repository.findOneOrFail(uuid, {
            join: {
                alias: "user_confirmation",
                leftJoinAndSelect: {
                    user: "user_confirmation.user",
                }
            }
        });
    }
}