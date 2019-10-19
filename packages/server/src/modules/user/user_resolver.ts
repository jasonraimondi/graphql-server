import { Arg, Query, Resolver } from "type-graphql";
import { inject, injectable } from "inversify";

import { User } from "@/entity/user_entity";
import { TYPES } from "@/lib/repository/repository_factory";
import { UserRepository } from "@/lib/repository/user/user_repository";

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
