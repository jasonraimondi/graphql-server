import { injectable } from "inversify";
import { Query, Resolver } from "type-graphql";

import { version } from "@root";

@Resolver()
@injectable()
export class AppResolver {
    @Query(() => String!)
    version() {
        return version;
    }
}