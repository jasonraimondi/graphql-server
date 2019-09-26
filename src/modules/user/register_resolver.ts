import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { hash } from "bcryptjs";

import { RegisterInput } from "@modules/user/register/register_input";
import { User } from "@entity/user";

@Resolver(User)
export class RegisterResolver {
    @Query(() => User)
    async user(
        @Arg('id') id: number,
    ) {
        return await User.findOne({ id });
    }

    @Mutation(() => User)
    async register(
        @Arg("data") data: RegisterInput,
    ): Promise<User> {
        const hashedPassword = await hash(data.password, 12);
        const user = await User.create({
            ...data,
            password: hashedPassword,
        });
        await user.save();
        return user;
    }
}