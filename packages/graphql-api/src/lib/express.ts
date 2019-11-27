import { Container } from "./inversify_container";
import { InversifyExpressServer } from "inversify-express-utils";
import { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { ENV } from "./constants/config";
import cookieParser from "cookie-parser";

const expressMiddlewares = (app: Application) => {
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

export const application = async (container: Container) => {
    const server = new InversifyExpressServer(container);
    server.setConfig(expressMiddlewares);
    return server.build();
};
