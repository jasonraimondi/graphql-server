import { Arg, Ctx, Int, Mutation, Resolver } from "type-graphql";
import { compare, hash } from "bcryptjs";
import { v4 } from "uuid";
import { Repository } from "typeorm";

import { RegisterInput } from "@modules/user/auth/register_input";
import { User } from "@entity/user";
import { LoginResponse } from "@modules/user/auth/login_response";
import { MyContext } from "@entity/types/my_context";
import { createAccessToken, createRefreshToken } from "@handlers/auth";
import { sendRefreshToken } from "@handlers/send_refresh_token";
import { LoginInput } from "@modules/user/auth/login_input";

@Resolver(User)
export class AuthResolver {
    constructor(private readonly userRepository: Repository<User>) {
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

        // login successful

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


    @Mutation(() => User)
    async register(
        @Arg("data") { firstName, lastName, email, password }: RegisterInput,
    ): Promise<User> {
        const hashedPassword = await hash(password, 12);
        const uuid = v4();
        const user = await User.create({
            uuid,
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await user.save();
        return user;
    }

    @Mutation(() => Boolean)
    async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: string) {
        try {
            await this.userRepository.increment({ uuid: userId }, "tokenVersion", 1);
            return true;
        } catch (e) {
        }
        return false;
    }
}
