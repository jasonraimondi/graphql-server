import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";

import { ApolloServer } from "apollo-server-express";
import { Container } from "inversify";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";

import { AuthResolver } from "@modules/user/auth_resolver";
import { refreshToken } from "@handlers/refresh_token";
import { MeResolver } from "@modules/user/me_resolver";
import { UserResolver } from "@modules/user/user_resolver";
import { ResolveTime } from "@modules/middlewares/resolve_time";
import { AppResolver } from "@modules/app/app_resolver";
import {RepositoryFactory, TYPES, UserRepository} from "@modules/repository/repository_factory";


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
        AppResolver,
        AuthResolver,
        MeResolver,
        UserResolver,
    ];

    const connection = await createConnection();
    console.log(connection.isConnected);
    const repositoryFactory = new RepositoryFactory(connection);

    const container = new Container();
    container.bind<AuthResolver>(AuthResolver).toSelf();
    container.bind<UserRepository>(TYPES.UserRepository).toConstantValue(repositoryFactory.userRepository);

    const globalMiddlewares = [];
    if (process.env.ENABLE_DEBUGGING) globalMiddlewares.push(ResolveTime);
    const schema = await buildSchema({
        resolvers,
        globalMiddlewares,
        container,
    });

    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(4000, () => "server started on localhost:4000");
})();

