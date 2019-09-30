import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";

import { User } from "@entity/user";
import { isAuth } from "@modules/user/is_auth";
import { UserRepository } from "../../repository_factory";

@Resolver(User)
export class UserResolver {
    constructor(private readonly userRepository: UserRepository) {}

    @Query(() => User)
    @UseMiddleware(isAuth)
    async user(@Arg("uuid") uuid: string) {
        return await this.userRepository.findById(uuid);
    }

    @Query(() => [User])
    @UseMiddleware(isAuth)
    async users() {
        return await this.userRepository.find();
    }
}
