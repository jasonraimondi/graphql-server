import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";
import nodemailer from "nodemailer";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { refreshToken } from "@/lib/handlers/refresh_token";
import { RepositoryFactory } from "@/lib/repository/repository_factory";
import { ResolveTime } from "@/lib/middleware/resolve_time";
import { Container } from "@/lib/inversify";
import { ServiceFactory } from "@/lib/services/service_factory";

if (!process.env.MAILER) throw new Error("process.env.MAILER is undefined");

if (process.env.ENABLE_DEBUGGING) console.log("DEBUGGING ENABLED");


const globalMiddlewares = (enableDebugging: boolean) => {
    const result = [];
    if (enableDebugging) result.push(ResolveTime);
    return result;
};

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


    const repositoryFactory = new RepositoryFactory(
        await createConnection()
    );
    const serviceFactory = new ServiceFactory(
        nodemailer.createTransport(process.env.MAILER),
    );
    const container = new Container(repositoryFactory, serviceFactory);

    const schema = await buildSchema({
        container,
        globalMiddlewares: globalMiddlewares(!!process.env.ENABLE_DEBUGGING),
        resolvers: [__dirname + "/modules/**/*_resolver.ts"],
    });

    const apolloServer = new ApolloServer({
        schema,
        context: ({req, res}) => ({req, res, container}),
    });

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(4000, () => "server started on localhost:4000");
})();
