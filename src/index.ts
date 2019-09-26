import "reflect-metadata";
import { ApolloServer} from "apollo-server-express";
import * as Express from "express";
import {buildSchema, Query, Resolver} from "type-graphql";

@Resolver()
class RecipeResolver {
    @Query(() => String)
    async helloWorld() {
        return "foo";
    }
}

const main = async () => {
    const schema = await buildSchema({
        resolvers: [RecipeResolver],
    });
    const apolloServer = new ApolloServer({schema});
    const app = Express();
    apolloServer.applyMiddleware({app});
    app.listen(4000, () => 'server started on localhost:4000');
};

main();