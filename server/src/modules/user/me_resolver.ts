import { verify } from "jsonwebtoken";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { inject, injectable } from "inversify";

import { MyContext } from "@/entity/types/my_context";
import { isAuth } from "@/lib/middleware/is_auth";
import { TYPES } from "@/lib/repository/repository_factory";
import { UserRepository } from "@/lib/repository/user_repository";
import { User } from "@/entity/user";

@injectable()
@Resolver()
export class MeResolver {
    constructor(@inject(TYPES.UserRepository) private userRepository: UserRepository) {
    }

    @Query(() => User)
    @UseMiddleware(isAuth)
    me(@Ctx() context: MyContext) {
        const authorization = context.req.headers["authorization"];
        if (!authorization) {
            return null;
        }

        const token = authorization.split(" ")[1];
        const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        return this.userRepository.findById(payload.userId);
    }
}