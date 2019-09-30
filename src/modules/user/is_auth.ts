import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";

import { MyContext } from "@entity/types/my_context";

export const isAuth: MiddlewareFn<MyContext> = (foo, next) => {
    console.log(!!foo, foo);
    const authorization = foo.context.req.headers["authorization"];

    if (!authorization) {
        throw new Error("not authenticated");
    }

    try {
        const token = authorization.split(" ")[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
        foo.context.payload = payload as any;
    } catch (err) {
        throw new Error("not authenticated");
    }

    return next();
};

export const ResolveTime: MiddlewareFn = async ({ info }, next) => {
    const start = Date.now();
    await next();
    const resolveTime = Date.now() - start;
    console.log(`${info.parentType.name}.${info.fieldName} [${resolveTime} ms]`);
};