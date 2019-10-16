import { Arg, Query, Resolver } from "type-graphql";

import { User } from "@/entity/user";
import { inject, injectable } from "inversify";
import { TYPES } from "@/modules/repository/repository_factory";
import { UserRepository } from "@/modules/repository/user_repository";

@injectable()
@Resolver(User)
export class UserResolver {
    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {
    }

    @Query(() => User)
    async user(@Arg("uuid") uuid: string) {
        return await this.userRepository.findById(uuid);
    }

    @Query(() => [User])
    users() {
        return this.userRepository.find();
    }
}
