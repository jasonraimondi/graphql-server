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

import { refreshToken } from "@/handlers/refresh_token";
import { RepositoryFactory } from "@/modules/repository/repository_factory";
import { ResolveTime } from "@/modules/middlewares/resolve_time";
import { Container } from "@/inversify";
import { ServiceFactory } from "@/services/service_factory";

if (!process.env.MAILER) throw new Error("process.env.MAILER is undefined");

if (process.env.ENABLE_DEBUGGING) console.log("DEBUGGING ENABLED");

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
        globalMiddlewares: middleware(),
        resolvers: [__dirname + "/modules/**/*_resolver.ts"],
    });

    const apolloServer = new ApolloServer({
        schema,
        context: ({req, res}) => ({req, res}),
    });

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(4000, () => "server started on localhost:4000");
})();

function middleware() {
    const globalMiddlewares = [];
    if (process.env.ENABLE_DEBUGGING) globalMiddlewares.push(ResolveTime);
    return globalMiddlewares;
}
