import { injectable } from "inversify";
import { Query, Resolver } from "type-graphql";

import { version, author, name, license } from "@root";
import { AppInfoResponse } from "@/modules/app/info/app_info_response";

@injectable()
@Resolver()
export class AppResolver {
    @Query(() => AppInfoResponse!)
    info() {
        return { name, author, version, license };
    }
}
