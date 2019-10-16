import { inject, injectable } from "inversify";
import { Arg, Mutation, Resolver } from "type-graphql";

import { TYPES } from "@/modules/repository/repository_factory";
import { UserConfirmationRepository } from "@/modules/repository/user_confirmation_repository";

@injectable()
@Resolver()
export class UserConfirmationResolver {
    constructor(@inject(TYPES.UserConfirmationRepository) private userConfirmationRepository: UserConfirmationRepository) {
    }

    @Mutation(() => Boolean!)
    async verifyUserConfirmation(
        @Arg("uuid") uuid: string,
        @Arg("email") email: string,
    ): Promise<boolean> {
        const userConfirmation = await this.userConfirmationRepository.findById(uuid);
        if (userConfirmation.user.email !== email) {
            throw new Error("invalid user and confirmation");
        }
        console.log(await this.userConfirmationRepository.delete(userConfirmation.uuid));
        console.log(uuid, email);
        console.log(userConfirmation.user);
        return false;
    }
}
