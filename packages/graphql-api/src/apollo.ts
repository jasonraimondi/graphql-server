import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";

import { Container } from "./lib/inversify_container";
import { ResolveTime } from "./lib/middleware/resolve_time";
import { ENV } from "./lib/constants/config";

export const initializeApolloServer = async (container: Container) => {
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
