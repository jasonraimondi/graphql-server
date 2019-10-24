import { User } from "@/entity/user/user_entity";
import { Role } from "@/entity/role/role_entity";
import { Permission } from "@/entity/role/permission_entity";
import { ForgotPassword } from "@/entity/user/forgot_password_entity";
import { EmailConfirmation } from "@/entity/user/email_confirmation_entity";
import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { MyContext } from "@/lib/types/my_context";
import { mockRequest, mockResponse } from "@/modules/user/auth_resolver.spec";
import { isAuth } from "@/lib/middleware/is_auth";

describe("is_auth", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let context: MyContext;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        context = {
            res: mockResponse(),
            req: mockRequest(),
            container,
        };
    });

    test("updates context", async () => {
        // arrange
        // act
        const params: any = { context };
        const next: any = () => {};

        // assert
        await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
    });

    test("guards against missing token", async () => {
        // arrange
        // act
        const params: any = { context };
        const next: any = () => {};

        // assert
        await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
    });

    test("guards against invalid token", async () => {
        // arrange
        context = {
            req: mockRequest("bearer foobar-valid-jwt"),
            res: mockResponse(),
            container,
        };

        // act
        const params: any = { context };
        const next: any = () => {};

        // assert
        await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
    });
});
