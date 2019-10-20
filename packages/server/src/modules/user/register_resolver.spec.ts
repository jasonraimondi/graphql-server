import { RegisterResolver } from "@/modules/user/register_resolver";
import { TestingInversifyContainer } from "@/lib/testing_inversify_container";

describe("register_resolver", () => {
    test("user is registered correctly", async () => {
        const container = await TestingInversifyContainer.create();
        const register = container.get(RegisterResolver);
        console.log(register);
        expect(register).toBe(typeof RegisterResolver);
    });
});