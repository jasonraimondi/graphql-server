import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";

import { MyContext } from "@/lib/types/my_context";
import { ENV } from "@/lib/constants/config";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
        throw new Error("not authenticated");
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, ENV.accessTokenSecret);
        context.payload = payload as any;
    } catch (err) {
        throw new Error("not authenticated");
    }

    return next();
};

