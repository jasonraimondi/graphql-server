import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";

import nodemailer from "nodemailer";
import { ApolloServer } from "apollo-server-express";
import { Container } from "inversify";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";
import Express from "express";

import { refreshToken } from "@/handlers/refresh_token";
import { RepositoryFactory, TYPES} from "@/modules/repository/repository_factory";
import { AppResolver } from "@/modules/app/app_resolver";
import { MeResolver } from "@/modules/user/me_resolver";
import { ResolveTime } from "@/modules/middlewares/resolve_time";
import { AuthResolver } from "@/modules/user/auth_resolver";
import { UserResolver } from "@/modules/user/user_resolver";
import { UserRepository } from "@/modules/repository/user_repository";
import { EmailService } from "@/services/email_service";

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

    const resolvers = [
        AppResolver,
        AuthResolver,
        MeResolver,
        UserResolver,
    ];


    const transporter = nodemailer.createTransport(
        `smtp://localhost:1025`
    );
    const emailService = new EmailService(transporter);
    await emailService.send({
        to: "jason@raimondi.us",
        from: "noreply@example.com",
        subject: "this is my subject",
        text: "this is my text",
        html: "<strong>boo html</strong>"
    });


    const connection = await createConnection();
    const isConnected = connection.isConnected;

    const repositoryFactory = new RepositoryFactory(connection);
    const container = new Container();

    container.bind<AuthResolver>(AuthResolver).toSelf();
    container.bind<AppResolver>(AppResolver).toSelf();
    container.bind<MeResolver>(MeResolver).toSelf();
    container.bind<UserResolver>(UserResolver).toSelf();

    container.bind<UserRepository>(TYPES.UserRepository).toConstantValue(repositoryFactory.userRepository);

    const globalMiddlewares = [];
    if (process.env.ENABLE_DEBUGGING) {
        console.log({
            debug: true,
            isConnected
        });
        globalMiddlewares.push(ResolveTime);
    }
    const schema = await buildSchema({
        resolvers,
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

