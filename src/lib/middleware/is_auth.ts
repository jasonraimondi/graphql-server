import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import jwtDecode from "jwt-decode";

import { MyContext } from "@/lib/types/my_context";
import { ENV } from "@/lib/constants/config";

export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
    const authorization = context.req.get("authorization");
    if (!authorization) {
        throw new Error("not authenticated");
    }
    try {
        const token = authorization.split(" ")[1];
        const verif = verify(token, ENV.accessTokenSecret);
        console.log({verif});
        const decoded = await jwtDecode<{ userId: string }>(token);
        console.log(context, decoded);
    } catch (err) {
        throw new Error("not authenticated");
    }

    return next();
};
