import { Arg, Mutation, Resolver } from "type-graphql";
import { hash } from "bcryptjs";
import { v4 } from "uuid";
import { inject, injectable } from "inversify";

import { RegisterInput } from "@/modules/user/auth/register_input";
import { UserConfirmation } from "@/entity/user_confirmation";
import { RegisterResponse } from "@/modules/user/auth/register_response";
import { TYPES} from "@/modules/repository/repository_factory";
import { UserRepository } from "@/modules/repository/user_repository";

@injectable()
@Resolver()
export class RegisterResolver {

    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {
    }

    @Mutation(() => RegisterResponse)
    async register(
        @Arg("data") { uuid, firstName, lastName, email, password }: RegisterInput,
    ): Promise<RegisterResponse> {
        const hashedPassword = await hash(password, 12);
        const user = await this.userRepository.create({
            uuid: uuid ? uuid : v4(),
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        const userConfirmation = await UserConfirmation.create({
            uuid: v4(),
            user,
        });
        await user.save();
        await userConfirmation.save();
        return {
            user,
            userConfirmation
        };
    }
}
