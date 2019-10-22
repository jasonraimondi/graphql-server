import { Arg, Ctx, Mutation, Resolver } from "type-graphql";
import { inject, injectable } from "inversify";

import { User } from "@/entity/user_entity";
import { LoginInput } from "@/modules/user/auth/login_input";
import { LoginResponse } from "@/modules/user/auth/login_response";
import { MyContext } from "@/lib/types/my_context";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { REPOSITORY, SERVICE } from "@/lib/constants/inversify";
import { AuthService, sendRefreshToken } from "@/lib/services/auth/auth_service";

@injectable()
@Resolver(User)
export class AuthResolver {

    constructor(
        @inject(REPOSITORY.UserRepository) private userRepository: UserRepository,
        @inject(SERVICE.AuthService) private authService: AuthService,
    ) {}

    @Mutation(() => LoginResponse)
    async login(
        @Arg("data") { email, password }: LoginInput,
        @Ctx() { res }: MyContext,
    ): Promise<LoginResponse> {
        const user = await this.userRepository.findByEmail(email);

        await user.verify(password);

        sendRefreshToken(res, this.authService.createRefreshToken(user));

        await this.userRepository.incrementLastLoginAt(user);

        return {
            accessToken: this.authService.createAccessToken(user),
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
            await this.userRepository.findById(userId);
            await this.userRepository.incrementToken(userId);
            return true;
        } catch {
            return false;
        }
    }
}
