import { Arg, Mutation, Resolver } from "type-graphql";
import { hash } from "bcryptjs";
import { v4 } from "uuid";
import { inject, injectable } from "inversify";

import { RegisterInput } from "@/modules/user/auth/register_input";
import { RegisterResponse } from "@/modules/user/auth/register_response";
import { TYPES } from "@/lib/repository/repository_factory";
import { UserRepository } from "@/lib/repository/user_repository";
import { UserConfirmationRepository } from "@/lib/repository/user_confirmation_repository";
import { RegisterEmail } from "@/lib/services/email/user/register_email";
import { User } from "@/entity/user";

@injectable()
@Resolver()
export class RegisterResolver {

    constructor(
        @inject(TYPES.UserRepository) private userRepository: UserRepository,
        @inject(TYPES.UserConfirmationRepository) private userConfirmationRepository: UserConfirmationRepository,
        @inject(TYPES.RegisterEmail) private registerEmail: RegisterEmail,
    ) {
    }

    @Mutation(() => Boolean!)
    async resentConfirmEmail(
        @Arg("email") email: string,
    ): Promise<boolean> {
        const userConfirmation = await this.userConfirmationRepository.findByEmail(email);
        try {
            await this.registerEmail.send(userConfirmation);
            return true;
        } catch(e) {
            console.log(e);
        }
        return false;
    }

    @Mutation(() => RegisterResponse)
    async register(
        @Arg("data") { uuid, firstName, lastName, email, password }: RegisterInput,
    ): Promise<RegisterResponse> {
        const user = new User();
        user.uuid = uuid ? uuid : v4();
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.password = await hash(password, 12);
        try {
            await this.userRepository.save(user);
            const userConfirmation = await this.userConfirmationRepository.create({
                uuid: v4(),
                user,
            });
            await this.userConfirmationRepository.save(userConfirmation);
            await this.registerEmail.send(userConfirmation);
            return {
                user,
                userConfirmation
            };
        } catch (e) {
            console.log(e);
        }
        return {};
    }
}
