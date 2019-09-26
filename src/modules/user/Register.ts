import {Arg, FieldResolver, Mutation, Query, Resolver, Root} from "type-graphql";
import * as bcrypt from "bcryptjs"
import {User} from "../../entity/User";

@Resolver(User)
export class RegisterResolver {
    @Query(() => User)
    async user(
        @Arg('id') id: number,
    ) {
        const user = await User.findOne({id});
        console.log(id, user);
        return user;
    }

    @FieldResolver()
    async name(@Root() parent: User) {
        return `${parent.firstName} ${parent.lastName}`;
    }

    @Mutation(() => User)
    async register(
        @Arg('firstName') firstName: string,
        @Arg('lastName') lastName: string,
        @Arg('email') email: string,
        @Arg('password') password: string,
    ): Promise<User> {
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });
        await user.save();
        return user;
    }
}