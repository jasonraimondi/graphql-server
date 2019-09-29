import "reflect-metadata";
import "module-alias/register";

import cors from "cors";
import cookieParser from "cookie-parser";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { Connection, createConnection, Repository } from "typeorm";

import { AuthResolver } from "@modules/user/auth_resolver";
import { User } from "@entity/user";
import { refreshToken } from "@handlers/refresh_token";
import { MeResolver } from "@modules/user/me";
import { UserResolver } from "@modules/user/user_resolver";

const main = async () => {
    await createConnection();
    // const connection = await createConnection();
    // console.log(connection);
    // const repositoryFactory = new RepositoryFactory(connection);

    const app = Express();
    app.use(
        cors({
            origin: "http://localhost:3000",
            credentials: true,
        }),
    );
    app.use(cookieParser());
    app.post("/refresh_token", refreshToken);

    const schema = await buildSchema({
        resolvers: [MeResolver, AuthResolver, UserResolver],
    });
    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, cors: false });

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
