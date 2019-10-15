import { verify } from "jsonwebtoken";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";

import { User } from "@/entity/user";
import { MyContext } from "@/entity/types/my_context";
import { isAuth } from "@/modules/middlewares/is_auth";
import { injectable } from "inversify";

@injectable()
@Resolver()
export class MeResolver {
    @Query(() => User)
    @UseMiddleware(isAuth)
    me(@Ctx() context: MyContext) {
        const authorization = context.req.headers["authorization"];
        if (!authorization) {
            return null;
        }

        const token = authorization.split(" ")[1];
        const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        return User.findOne(payload.userId);
    }
}