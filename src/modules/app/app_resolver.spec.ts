import { AppResolver } from "@/modules/app/app_resolver";
import pkg from "@root";

describe("app_resolver", () => {
    test("version is resolved correctly", () => {
        const appResolver = new AppResolver();

        const version = appResolver.version();

        expect(version).toBe(pkg.version);
    });
});