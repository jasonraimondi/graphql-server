import "dotenv/config";
import "reflect-metadata";
import "module-alias/register";
import { createConnection } from "typeorm";
import { InversifyExpressServer } from "inversify-express-utils";

import { RepositoryFactory } from "@/lib/repository/repository_factory";
import { InversifyContainer } from "@/lib/inversify_container";
import { ServiceFactory } from "@/lib/services/service_factory";
import { expressMiddlewares, initializeApolloServer } from "@/init";

if (!process.env.MAILER) throw new Error("process.env.MAILER is undefined");

if (process.env.ENABLE_DEBUGGING) console.log("DEBUGGING ENABLED");

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
