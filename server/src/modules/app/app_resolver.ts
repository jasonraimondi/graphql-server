import { Query, Resolver } from "type-graphql";

import { version } from "@root/package.json";

@Resolver()
export class AppResolver {
    @Query(() => String!)
    version() {
        return version;
    }
}