import {Arg, Mutation, Query, Resolver} from "type-graphql";
import {hash} from "bcryptjs";
import {v4} from "uuid";

import {RegisterInput} from "@modules/user/register/register_input";
import {User} from "@entity/user";

@Resolver(User)
export class RegisterResolver {
    @Query(() => User)
    async user(@Arg('uuid') uuid: string) {
        return await User.findOne({uuid});
    }

    @Mutation(() => User)
    async register(
        @Arg("data") {firstName, lastName, email, password}: RegisterInput,
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
}
