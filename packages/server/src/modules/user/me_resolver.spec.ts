import {User} from "@/entity/user_entity";
import {Role} from "@/entity/role_entity";
import {Permission} from "@/entity/permission_entity";
import {ForgotPassword} from "@/entity/forgot_password_entity";
import {EmailConfirmation} from "@/entity/email_confirmation_entity";
import {TestingInversifyContainer} from "@/lib/testing_inversify_container";
import {MyContext} from "@/lib/types/my_context";
import {mockRequest, mockResponse} from "@/modules/user/auth_resolver.spec";
import {MeResolver} from "@/modules/user/me_resolver";

describe("me resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let context: MyContext;
    let resolver: MeResolver;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        context = {
            res: mockRequest({
                headers: {
                    Authorization: "Bearer foobarpoop",
                },
            }),
            req: mockResponse(),
            container,
        };
        resolver = container.get(MeResolver);
    });

    test("user logs in successfully", async () => {
        // arrange
        // act
        const result = await resolver.me(context);

        // assert
        expect(result).toBeNull();
    });
});