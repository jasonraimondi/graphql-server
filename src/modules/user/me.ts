import { verify } from "jsonwebtoken";
import { Ctx, Query, Resolver } from "type-graphql";

import { User } from "@entity/user";
import { MyContext } from "@entity/types/my_context";

@Resolver()
export class MeResolver {
    @Query(() => User, { nullable: true })
    me(@Ctx() context: MyContext) {
        console.log(!!context);
        const authorization = context.req.headers["authorization"];
        console.log({authorization});
        if (!authorization) {
            return null;
        }

        try {
            const token = authorization.split(" ")[1];
            const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
            return User.findOne(payload.userId);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

}