import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";

import { createConnection } from "typeorm";

import { RepositoryFactory } from "@/lib/repository/repository_factory";
import { InversifyContainer } from "@/lib/inversify_container";
import { ServiceFactory } from "@/lib/services/service_factory";
import { initializeApolloServer } from "@/apollo";
import { ENV } from "@/lib/constants/config";
import { application } from "@/lib/express";

(async () => {
    if (ENV.enableDebugging) {
        console.log("DEBUGGING ENABLED");
    }
    await import("./controllers/auth_controller");

    const repositoryFactory = new RepositoryFactory(await createConnection());
    const serviceFactory = new ServiceFactory(ENV.mailerURL);
    const container = new InversifyContainer(repositoryFactory, serviceFactory);
    const app = await application(container);
    const apolloServer = await initializeApolloServer(container);

    apolloServer.applyMiddleware({app, cors: false});
    app.listen(4000, () => "server started on localhost:4000");
})();
