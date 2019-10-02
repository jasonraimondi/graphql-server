import { Query, Resolver } from "type-graphql";

const { version } = require("../../../package.json");

@Resolver()
export class AppResolver {
    @Query(() => String!)
    version() {
        return version;
    }
}