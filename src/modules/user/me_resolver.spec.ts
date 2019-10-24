import { User } from "@/entity/user/user_entity";
import { Role } from "@/entity/role/role_entity";
import { Permission } from "@/entity/role/permission_entity";
import { ForgotPassword } from "@/entity/user/forgot_password_entity";
import { EmailConfirmation } from "@/entity/user/email_confirmation_entity";
import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { MyContext } from "@/lib/types/my_context";
import { mockRequest, mockResponse } from "@/modules/user/auth_resolver.spec";
import { MeResolver } from "@/modules/user/me_resolver";
import { REPOSITORY } from "@/lib/constants/inversify";
import { UserRepository } from "@/lib/repository/user/user_repository";

describe("me resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let context: MyContext;
    let resolver: MeResolver;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        context = {
            req: mockRequest(),
            res: mockResponse(),
            container,
        };
        resolver = container.get(MeResolver);
    });

    test("successfully returns user response", async () => {
        const userRepository = container.get<UserRepository>(REPOSITORY.UserRepository);
        const user = await userRepository.save(await User.create({ email: "jason@raimondi.us", }));

        context = {
            req: mockRequest(),
            res: mockResponse(),
            container,
            auth: {
                userId: user.uuid,
                email: user.email,
                isEmailConfirmed: user.isEmailConfirmed,
            }
        };

        // act
        const result: User|null = await resolver.me(context);

        // assert
        expect(result).toBeTruthy();
        expect(result!.uuid).toBe(user.uuid);
        expect(result!.email).toBe(user.email);
        expect(result!.isEmailConfirmed).toBe(user.isEmailConfirmed);
    });

    test("blank authorization throws", async () => {
        context = {
            req: mockRequest(),
            res: mockResponse(),
            container,
        };

        // act
        const result = resolver.me(context);

        // assert
        await expect(result).rejects.toThrowError(/Cannot read property 'userId' of undefined/);
    });
});