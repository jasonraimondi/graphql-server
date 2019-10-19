import "reflect-metadata";
import { AppResolver } from "@/modules/app/app_resolver";

describe("app_resolver", () => {
    test("version is resolved correctly", () => {
        const pkg = require("@root");
        const appResolver = new AppResolver();

        const version = appResolver.version();

        expect(version).toBe(pkg.version);
    });
});