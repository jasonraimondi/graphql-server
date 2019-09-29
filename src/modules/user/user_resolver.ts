import { Arg, Query, Resolver, UseMiddleware } from "type-graphql";

import { User } from "@entity/user";
import { isAuth } from "@modules/user/is_auth";

@Resolver(User)
export class UserResolver {
    @Query(() => User)
    @UseMiddleware(isAuth)
    async user(@Arg("uuid") uuid: string) {
        return await User.findOne({ uuid });
    }

    @Query(() => [User])
    users() {
        return User.find();
    }

    @Query(() => [User])
    @UseMiddleware(isAuth)
    usersb() {
        return User.find();
    }
}
