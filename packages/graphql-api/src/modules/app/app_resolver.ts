import { injectable } from "inversify";
import { Query, Resolver } from "type-graphql";

// import { author, license, name, version } from "../../../package.json";
import { AppInfoResponse } from "@/modules/app/info/app_info_response";

@injectable()
@Resolver()
export class AppResolver {
    @Query(() => AppInfoResponse!)
    info() {
        const name = "name";
        const author = "author";
        const version = "version";
        const license = "license";
        return { name, author, version, license };
    }
}
