import { injectable } from "inversify";
import { EntityRepository, Repository } from "typeorm";

import { ForgotPassword } from "@/entity/forgot_password_entity";

@injectable()
@EntityRepository(ForgotPassword)
export class ForgotPasswordRepository extends Repository<ForgotPassword> {
    findById(uuid: string): Promise<ForgotPassword> {
        return this.findOneOrFail(uuid, {
            join: {
                alias: "forgot_password_token",
                leftJoinAndSelect: {
                    user: "forgot_password_token.user",
                }
            }
        });
    }

    findForUser(userId: string): Promise<ForgotPassword> {
        return this.findOneOrFail({
            where: {
                user: userId
            },
            join: {
                alias: "forgot_password_token",
                leftJoinAndSelect: {
                    user: "forgot_password_token.user",
                }
            }
        });
    }
}