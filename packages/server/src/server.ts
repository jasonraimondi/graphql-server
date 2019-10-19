import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { InversifyExpressServer } from "inversify-express-utils";
import bodyParser from "body-parser";

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
    await import("./controllers/auth_controller");
    await import("./controllers/home_controller");

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

    const server = new InversifyExpressServer(container);
    server.setConfig(app => {
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        app.use(bodyParser.json());
        app.use(
            cors({
                origin: process.env.CORS,
                credentials: true,
            }),
        );
        app.use(cookieParser());
    });
    const app = server.build();

    const apolloServer = new ApolloServer({
        schema,
        context: ({req, res}) => ({req, res, container}),
    });

    apolloServer.applyMiddleware({app, cors: false});

    app.listen(4000, () => "server started on localhost:4000");
})();
