import "reflect-metadata";
import "module-alias/register";

import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { Connection, createConnection, Repository } from "typeorm";

import { RegisterResolver } from "@modules/user/register_resolver";
import { User } from "@entity/user";

const main = async () => {
    const connection = await createConnection();
    console.log(connection);
    // const repositoryFactory = new RepositoryFactory(connection);


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

export class RepositoryFactory {
    constructor(private readonly connection: Connection) {
    }

    get userRepository(): Repository<User> {
        return this.connection.getRepository<User>(User)
    }
}
