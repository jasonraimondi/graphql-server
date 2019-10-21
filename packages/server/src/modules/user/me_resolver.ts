import { verify } from "jsonwebtoken";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { inject, injectable } from "inversify";

import { isAuth } from "@/lib/middleware/is_auth";
import { User } from "@/entity/user_entity";
import { MyContext } from "@/lib/types/my_context";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { REPOSITORY } from "@/lib/constants/inversify";

@injectable()
@Resolver()
export class MeResolver {
    constructor(@inject(REPOSITORY.UserRepository) private userRepository: UserRepository) {
    }

    @Query(() => User)
    @UseMiddleware(isAuth)
    async me(@Ctx() context: MyContext) {
        console.log(context.req);
        const authorization = context.req.headers["authorization"];
        if (!authorization) {
            return null;
        }
        const token = authorization.split(" ")[1];
        const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        return await this.userRepository.findById(payload.userId);
    }
}