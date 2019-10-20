import { inject, injectable } from "inversify";
import { Arg, Mutation, Resolver } from "type-graphql";

import { EmailConfirmationRepository } from "@/lib/repository/user/email_confirmation_repository";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { REPOSITORIES } from "@/lib/constants/inversify";

@injectable()
@Resolver()
export class EmailConfirmationResolver {
    constructor(
        @inject(REPOSITORIES.User) private userRepository: UserRepository,
        @inject(REPOSITORIES.EmailConfirmation) private userConfirmationRepository: EmailConfirmationRepository
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
            await this.userConfirmationRepository.delete(userConfirmation.uuid);
            return true;
        } catch(e) {
            console.log(e);
        }
        return false;
    }
}
