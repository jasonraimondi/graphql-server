import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";

import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { InversifyExpressServer } from "inversify-express-utils";
import bodyParser from "body-parser";

import { RepositoryFactory } from "@/lib/repository/repository_factory";
import { ResolveTime } from "@/lib/middleware/resolve_time";
import { InversifyContainer } from "@/lib/inversify_container";
import { ServiceFactory } from "@/lib/services/service_factory";
import { Application } from "express";

if (!process.env.MAILER) throw new Error("process.env.MAILER is undefined");

if (process.env.ENABLE_DEBUGGING) console.log("DEBUGGING ENABLED");

const initializeApolloServer = async (container: InversifyContainer) => {
    const apolloMiddlewares = (enableDebugging: boolean) => {
        const result = [];
        if (enableDebugging) result.push(ResolveTime);
        return result;
    };

    const schema = await buildSchema({
        container,
        globalMiddlewares: apolloMiddlewares(!!process.env.ENABLE_DEBUGGING),
        resolvers: [__dirname + "/modules/**/*_resolver.ts"],
    });

    return new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res, container }),
    });
};

const expressMiddlewares = (app: Application) => {
    app.use(bodyParser.urlencoded({
        extended: true,
    }));
    app.use(bodyParser.json());
    app.use(
        cors({
            origin: process.env.CORS,
            credentials: true,
        }),
    );
    app.use(cookieParser());
};

(async () => {
    await import("./controllers/auth_controller");
    await import("./controllers/home_controller");
    const repositoryFactory = new RepositoryFactory(await createConnection());
    const serviceFactory = new ServiceFactory(process.env.MAILER);
    const container = new InversifyContainer(repositoryFactory, serviceFactory);
    const server = new InversifyExpressServer(container);
    server.setConfig(expressMiddlewares);
    const app = server.build();
    const apolloServer = await initializeApolloServer(container);
    apolloServer.applyMiddleware({app, cors: false});
    app.listen(4000, () => "server started on localhost:4000");
})();
