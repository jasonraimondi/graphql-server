import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { compare, hash } from "bcryptjs";
import { v4 } from "uuid";

import { MyContext } from "@entity/types/my_context";
import { User } from "@entity/user";
import { createAccessToken, createRefreshToken } from "@handlers/auth";
import { sendRefreshToken } from "@handlers/send_refresh_token";
import { LoginInput } from "@modules/user/auth/login_input";
import { LoginResponse } from "@modules/user/auth/login_response";
import { RegisterInput } from "@modules/user/auth/register_input";
import { ForgotPasswordInput } from "@modules/user/auth/forgot_password_input";
import { UserConfirmation } from "@entity/user_confirmation";
import { RegisterResponse } from "@modules/user/auth/register_response";
import { inject, injectable } from "inversify";
import {TYPES, UserRepository} from "@modules/repository/repository_factory";

@injectable()
@Resolver(User)
export class AuthResolver {
    private readonly userRepository: UserRepository;

    constructor(@inject(TYPES.UserRepository) _userRepository: UserRepository) {
        this.userRepository = _userRepository;
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("data") { email, password }: LoginInput,
        @Ctx() { res }: MyContext,
    ): Promise<LoginResponse> {
        const user = await User.findOneOrFail({ where: { email } });

        if (!user) {
            throw new Error("could not find user");
        }

        const valid = await compare(password, user.password);

        if (!valid) {
            throw new Error("bad password");
        }

        sendRefreshToken(res, createRefreshToken(user));

        return {
            accessToken: createAccessToken(user),
            user,
        };
    }

    @Mutation(() => Boolean)
    async logout(@Ctx() { res }: MyContext) {
        sendRefreshToken(res, "");
        return true;
    }

    @Mutation(() => Boolean)
    async forgotPassword(@Arg("data") { email }: ForgotPasswordInput) {
        console.log("implement forgot password", email);
        console.log(await this.userRepository.find());
        return true;
    }

    @Mutation(() => RegisterResponse)
    async register(
        @Arg("data") { uuid, firstName, lastName, email, password }: RegisterInput,
    ): Promise<RegisterResponse> {
        const hashedPassword = await hash(password, 12);
        const user = await User.create({
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

    // @Mutation(() => Boolean)
    // async revokeRefreshTokensForUser(@Arg("userId", () => String) userId: string) {
    //     try {
    //         await this.userRepository.increment({ uuid: userId }, "tokenVersion", 1);
    //         return true;
    //     } catch {
    //         return false;
    //     }
    // }
}
