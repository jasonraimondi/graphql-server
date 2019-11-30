import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";

import { createConnection } from "typeorm";

import { ENV } from "@/lib/constants/config";
import { initializeApolloServer } from "@/apollo";
import { ServiceFactory } from "@/lib/services/service_factory";
import { RepositoryFactory } from "@/lib/repository/repository_factory";
import { Container } from "@/lib/inversify_container";
import { application } from "@/lib/express";

(async () => {
    if (ENV.enableDebugging) {
        console.log("DEBUGGING ENABLED");
    }
    await import("@/controllers/auth_controller");

    const repositoryFactory = new RepositoryFactory(await createConnection());
    const serviceFactory = new ServiceFactory(ENV.mailerURL);
    const container = new Container(repositoryFactory, serviceFactory);
    const app = await application(container);
    const apolloServer = await initializeApolloServer(container);

    apolloServer.applyMiddleware({ app, cors: false });
    app.listen(4000, () => "server started on localhost:4000");
})().catch(e => console.error(e));
