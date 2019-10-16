import { Arg, Mutation, Resolver } from "type-graphql";
import { inject, injectable } from "inversify";

import { ForgotPasswordInput } from "@/modules/user/auth/forgot_password_input";
import { TYPES} from "@/modules/repository/repository_factory";
import { UserRepository } from "@/modules/repository/user_repository";
import { ForgotPasswordEmail } from "@/services/email/forgot_password/forgot_password_email";

@injectable()
@Resolver()
export class ForgotPasswordResolver {
    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository,
                @inject(TYPES.ForgotPasswordEmail) private forgotPasswordEmail: ForgotPasswordEmail) {
    }

    @Mutation(() => Boolean)
    async forgotPassword(@Arg("data") { email }: ForgotPasswordInput) {
        const user = await this.userRepository.findByEmail(email);
        await this.forgotPasswordEmail.send(user.email);
        return true;
    }
}
