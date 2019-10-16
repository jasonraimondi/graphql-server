import { injectable } from "inversify";
import { Query, Resolver } from "type-graphql";

import { version } from "@root";

@injectable()
@Resolver()
export class AppResolver {
    @Query(() => String!)
    version() {
        return version;
    }
}