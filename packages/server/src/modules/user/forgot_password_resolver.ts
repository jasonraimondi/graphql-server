import { Arg, Mutation, Resolver } from "type-graphql";
import { inject, injectable } from "inversify";
import v4 from "uuid/v4";
import { hash } from "bcryptjs";

import { SendForgotPasswordInput, UpdatePasswordInput } from "@/modules/user/auth/forgot_password_input";
import { ForgotPasswordEmail } from "@/lib/services/email/user/forgot_password_email";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { ForgotPasswordRepository } from "@/lib/repository/user/forgot_password_repository";
import { User } from "@/entity/user_entity";
import { REPOSITORIES, SERVICES } from "@/lib/constants/inversify";

@injectable()
@Resolver()
export class ForgotPasswordResolver {
    constructor(
        @inject(REPOSITORIES.User) private userRepository: UserRepository,
        @inject(REPOSITORIES.ForgotPassword) private forgotPasswordRepository: ForgotPasswordRepository,
        @inject(SERVICES.ForgotPasswordEmail) private forgotPasswordEmail: ForgotPasswordEmail,
    ) {
    }

    @Mutation(() => Boolean)
    async updatePasswordFromToken(@Arg("data") { token, email, password }: UpdatePasswordInput) {
        const forgotPassword = await this.forgotPasswordRepository.findById(token);
        const { user } = forgotPassword;
        if (email !== user.email) {
            throw new Error("invalid email");
        }
        user.password = await hash(password, 12);
        try {
            await this.userRepository.save(user);
            await this.forgotPasswordRepository.delete(forgotPassword.uuid);
            return true;
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    @Mutation(() => Boolean)
    async sendForgotPasswordEmail(@Arg("data") { email }: SendForgotPasswordInput) {
        const user = await this.userRepository.findByEmail(email);
        const forgotPassword = await this.getForgotPasswordForUser(user);
        try {
            await this.forgotPasswordRepository.save(forgotPassword);
            await this.forgotPasswordEmail.send(forgotPassword);
            return true;
        } catch (e) {
            console.log(e);
        }
        return false;
    }

    private async getForgotPasswordForUser(user: User) {
        try {
            return await this.forgotPasswordRepository.findForUser(user.uuid);
        } catch (e) {}
        const forgotPassword = this.forgotPasswordRepository.create({
            uuid: v4(),
            user,
            createdAt: new Date(),
        });
        await this.forgotPasswordRepository.save(forgotPassword);
        return forgotPassword;
    }
}
