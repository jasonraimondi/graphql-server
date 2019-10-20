import { Arg, Query, Resolver } from "type-graphql";
import { inject, injectable } from "inversify";

import { User } from "@/entity/user_entity";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { REPOSITORIES } from "@/lib/constants/inversify";

@injectable()
@Resolver(User)
export class UserResolver {
    constructor(@inject(REPOSITORIES.User) private userRepository: UserRepository) {
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
