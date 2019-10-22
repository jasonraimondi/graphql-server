import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";

import { InversifyContainer } from "@/lib/inversify_container";
import { ResolveTime } from "@/lib/middleware/resolve_time";
import { ENV } from "@/lib/constants/config";

export const initializeApolloServer = async (container: InversifyContainer) => {
    const apolloMiddlewares = (enableDebugging: boolean) => {
        const result = [];
        if (enableDebugging) result.push(ResolveTime);
        return result;
    };

    const schema = await buildSchema({
        container,
        globalMiddlewares: apolloMiddlewares(ENV.enableDebugging),
        resolvers: [__dirname + "/modules/**/*_resolver.ts"],
    });

    return new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res, container }),
    });
};

export const expressMiddlewares = (app: Application) => {
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());
    app.use(
        cors({
            origin: ENV.cors,
            credentials: true,
        }),
    );
    app.use(cookieParser());
};
