import { injectable } from "inversify";
import { EntityRepository, Repository } from "typeorm";

import { EmailConfirmation } from "@/entity/email_confirmation";

@injectable()
@EntityRepository(EmailConfirmation)
export class EmailConfirmationRepository extends Repository<EmailConfirmation> {
    findByEmail(email: string): Promise<EmailConfirmation> {
        return this.findOneOrFail({
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
        return this.findOneOrFail(uuid, {
            join: {
                alias: "user_confirmation",
                leftJoinAndSelect: {
                    user: "user_confirmation.user",
                }
            }
        });
    }
}