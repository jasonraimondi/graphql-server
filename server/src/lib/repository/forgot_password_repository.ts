import { injectable } from "inversify";
import { Repository } from "typeorm";

import { BaseRepository } from "@/lib/repository/base_repository";
import { ForgotPassword } from "@/entity/forgot_password";

@injectable()
export class ForgotPasswordRepository extends BaseRepository<ForgotPassword> {
    constructor(repository: Repository<ForgotPassword>) {
        super(repository);
    }

    findById(uuid: string): Promise<ForgotPassword> {
        return this.repository.findOneOrFail(uuid, {
            join: {
                alias: "forgot_password_token",
                leftJoinAndSelect: {
                    user: "forgot_password_token.user",
                }
            }
        });
    }

    findForUser(userId: string): Promise<ForgotPassword> {
        return this.repository.findOneOrFail({
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