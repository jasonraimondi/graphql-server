import { Arg, Query, Resolver } from "type-graphql";

import { User } from "@entity/user";

@Resolver(User)
export class UserResolver {
    @Query(() => User)
    async user(@Arg("uuid") uuid: string) {
        return await User.findOne({ uuid });
    }

    @Query(() => [User])
    users() {
        return User.find();
    }
}
