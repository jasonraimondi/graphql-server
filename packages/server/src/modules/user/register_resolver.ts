import { Arg, Mutation, Resolver } from "type-graphql";
import { hash } from "bcryptjs";
import { inject, injectable } from "inversify";

import { RegisterInput } from "@/modules/user/auth/register_input";
import { RegisterResponse } from "@/modules/user/auth/register_response";
import { RegisterEmail } from "@/lib/services/email/user/register_email";
import { User } from "@/entity/user_entity";
import { EmailConfirmationRepository } from "@/lib/repository/user/email_confirmation_repository";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { REPOSITORIES, SERVICES } from "@/lib/constants/inversify";

@injectable()
@Resolver()
export class RegisterResolver {
    constructor(
        @inject(REPOSITORIES.User) private userRepository: UserRepository,
        @inject(REPOSITORIES.EmailConfirmation) private userConfirmationRepository: EmailConfirmationRepository,
        @inject(SERVICES.RegisterEmail) private registerEmail: RegisterEmail,
    ) {}

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

    @Mutation(() => RegisterResponse!)
    async register(
        @Arg("data") registerInput: RegisterInput,
    ): Promise<RegisterResponse> {
        const { email, uuid, password } = registerInput;
        await this.guardAgainstDuplicateUser(email, uuid);
        const user = User.create(registerInput);
        user.password = password ? await hash(password, 12) : undefined;
        try {
            await this.userRepository.save(user);
            const userConfirmation = new EmailConfirmation();
            userConfirmation.user = user;
            await this.userConfirmationRepository.save(userConfirmation);
            await this.registerEmail.send(userConfirmation);
            return { user, userConfirmation };
        } catch (e) {
            console.log(e);
        }
        return {};
    }

    private async guardAgainstDuplicateUser(email: string, uuid?: string) {
        const falsy = () => false;
        if (uuid && await this.userRepository.findById(uuid).catch(falsy)) {
            throw new Error("duplicate uuid for user");
        }
        if (await this.userRepository.findByEmail(email).catch(falsy)) {
            throw new Error("duplicate email for user");
        }
    }
}

