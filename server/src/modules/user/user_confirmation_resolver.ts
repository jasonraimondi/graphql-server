import { inject, injectable } from "inversify";
import { Arg, Mutation, Resolver } from "type-graphql";

import { TYPES } from "@/modules/repository/repository_factory";
import { UserRepository } from "@/modules/repository/user_repository";
import { UserConfirmationRepository } from "@/modules/repository/user_confirmation_repository";

@injectable()
@Resolver()
export class UserConfirmationResolver {
    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.UserConfirmationRepository) private userConfirmationRepository: UserConfirmationRepository
    ) {
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
        try {
            const { user } = userConfirmation;
            user.isEmailConfirmed = true;
            await this.userRepository.save(user);
            await this.userConfirmationRepository.delete(userConfirmation.uuid)
            return true;
        } catch(e) {
            console.log(e);
        }
        return false;
    }
}
