import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";
import nodemailer from "nodemailer";

import { refreshToken } from "@/handlers/refresh_token";
import { RepositoryFactory } from "@/modules/repository/repository_factory";
import { ResolveTime } from "@/modules/middlewares/resolve_time";
import { Container } from "@/inversify";
import { ServiceFactory } from "@/services/service_factory";

(async () => {
    const app = Express();
    app.use(
        cors({
            origin: process.env.CORS,
            credentials: true,
        }),
    );
    app.use(cookieParser());
    app.get("/", (_req, res) => res.redirect("/graphql"));
    app.post("/refresh_token", refreshToken);


    const connection = await createConnection();

    const repositoryFactory = new RepositoryFactory(connection);
    const serviceFactory = new ServiceFactory(
        nodemailer.createTransport(process.env.MAILER),
    );
    const container = new Container(repositoryFactory, serviceFactory);

    const globalMiddlewares = [];
    if (process.env.ENABLE_DEBUGGING) {
        console.log({
            debug: process.env.ENABLE_DEBUGGING,
            isConnected: connection.isConnected,
        });
        globalMiddlewares.push(ResolveTime);
    }
    const schema = await buildSchema({
        resolvers: [__dirname + "/modules/**/*_resolver.ts"],
        globalMiddlewares,
        container,
    });

    const apolloServer = new ApolloServer({
        schema,
        context: ({req, res}) => ({req, res}),
    });

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(4000, () => "server started on localhost:4000");
})();

