import { AppResolver } from "@/modules/app/app_resolver";
import pkg from "@root";

describe("app_resolver", () => {
    test("version is resolved correctly", () => {
        const appResolver = new AppResolver();

        const { version, name, license } = appResolver.info();

        expect(version).toBe(pkg.version);
        expect(name).toBe(pkg.name);
        expect(license).toBe(pkg.license);
    });
});