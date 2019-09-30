import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";

import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";

import { AuthResolver } from "@modules/user/auth_resolver";
import { refreshToken } from "@handlers/refresh_token";
import { MeResolver } from "@modules/user/me";
import { UserResolver } from "@modules/user/user_resolver";
import { ResolveTime } from "@modules/user/is_auth";

(async () => {
    const app = Express();
    app.use(
        cors({
            origin: process.env.CORS,
            credentials: true,
        }),
    );
    app.use(cookieParser());
    app.get("/", (_req, res) => res.send("hello"));
    app.post("/refresh_token", refreshToken);

    const resolvers = [
        AuthResolver,
        MeResolver,
        UserResolver,
    ];
    const globalMiddlewares = [];
    if (process.env.ENABLE_DEBUGGING) globalMiddlewares.push(ResolveTime);
    const schema = await buildSchema({
        resolvers,
        globalMiddlewares,
    });

    const connection = await createConnection();
    console.log("isConnected:", connection.isConnected);
    // const repositoryFactory = new RepositoryFactory(connection);

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(4000, () => "server started on localhost:4000");
})();

