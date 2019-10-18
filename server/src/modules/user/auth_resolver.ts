import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { compare } from "bcryptjs";
import { inject, injectable } from "inversify";

import { MyContext } from "@/entity/types/my_context";
import { User } from "@/entity/user";
import { LoginInput } from "@/modules/user/auth/login_input";
import { LoginResponse } from "@/modules/user/auth/login_response";
import { TYPES} from "@/lib/repository/repository_factory";
import { UserRepository } from "@/lib/repository/user_repository";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "@/lib/services/auth/auth_service";

@injectable()
@Resolver(User)
export class AuthResolver {

    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg("data") { email, password }: LoginInput,
        @Ctx() { res }: MyContext,
    ): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            throw new Error("could not find user");
        }

        const valid = await compare(password, user.password);

        if (!valid) {
            throw new Error("bad password");
        }

        sendRefreshToken(res, createRefreshToken(user));

        await this.userRepository.incrementLastLoginAt(user);

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
    async revokeRefreshToken(@Arg("userId", () => String) userId: string) {
        try {
            await this.userRepository.incrementToken(userId);
            return true;
        } catch {
            return false;
        }
    }
}
