import { injectable } from "inversify";
import { Repository } from "typeorm";

import { BaseRepository } from "@/lib/repository/base_repository";
import { EmailConfirmation } from "@/entity/email_confirmation";

@injectable()
export class UserConfirmationRepository extends BaseRepository<EmailConfirmation> {
    constructor(repository: Repository<EmailConfirmation>) {
        super(repository);
    }

    findByEmail(email: string): Promise<EmailConfirmation> {
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

    findById(uuid: string): Promise<EmailConfirmation> {
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