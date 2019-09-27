import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { hash } from "bcryptjs";
import { v4 } from "uuid";

import { RegisterInput } from "@modules/user/register/register_input";
import { User } from "@entity/user";

@Resolver(User)
export class RegisterResolver {
    @Query(() => User)
    async user(
        @Arg('uuid') uuid: string,
    ) {
        return await User.findOne({ uuid });
    }

    @Mutation(() => User)
    async register(
        @Arg("data") data: RegisterInput,
    ): Promise<User> {
        const hashedPassword = await hash(data.password, 12);
        const user = await User.create({
            ...data,
            uuid: v4(),
            password: hashedPassword,
        });
        await user.save();
        return user;
    }
}