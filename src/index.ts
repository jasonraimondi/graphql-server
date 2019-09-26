import "reflect-metadata";
import "module-alias/register";

import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";

import { RegisterResolver } from "@modules/user/register_resolver";

const main = async () => {
    await createConnection();

    const schema = await buildSchema({
        resolvers: [RegisterResolver],
    });
    const apolloServer = new ApolloServer({
        schema,
    });
    const app = Express();
    apolloServer.applyMiddleware({app});
    app.listen(4000, () => 'server started on localhost:4000');
};

main().catch(e => console.log(e));