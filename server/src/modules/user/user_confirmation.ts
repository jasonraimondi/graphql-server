import { Arg, Query, Resolver } from "type-graphql";

import { inject, injectable } from "inversify";
import { UserConfirmation } from "@/entity/user_confirmation";
import { TYPES } from "@/modules/repository/repository_factory";
import { UserConfirmationRepository } from "@/modules/repository/user_confirmation_repository";

@injectable()
@Resolver(UserConfirmation)
export class UserResolver {
    constructor(@inject(TYPES.UserConfirmation) private userConfirmationRepository: UserConfirmationRepository) {
    }

    @Query(() => UserConfirmation)
    async userConfirmation(@Arg("uuid") uuid: string) {
        return await this.userConfirmationRepository.findById(uuid);
    }
}
