import { User } from "@/entity/user_entity";
import { Role } from "@/entity/role_entity";
import { Permission } from "@/entity/permission_entity";
import { ForgotPassword } from "@/entity/forgot_password_entity";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { MyContext } from "@/lib/types/my_context";
import { mockRequest, mockResponse } from "@/modules/user/auth_resolver.spec";
import { MeResolver } from "@/modules/user/me_resolver";
import { REPOSITORY, SERVICE } from "@/lib/constants/inversify";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { AuthService } from "@/lib/services/auth/auth_service";

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
        const authService = container.get<AuthService>(SERVICE.AuthService);
        const user = await userRepository.save(await User.create({ email: "jason@raimondi.us", }));

        context = {
            req: mockRequest(`bearer ${authService.createAccessToken(user)}`),
            res: mockResponse(),
            container,
        };

        // act
        const result: User|null = await resolver.me(context);

        // assert
        expect(result).toBeTruthy();
        expect(result!.uuid).toBe(user.uuid);
        expect(result!.email).toBe(user.email);
        expect(result!.isEmailConfirmed).toBe(user.isEmailConfirmed);
    });

    test("invalid token throws", async () => {
        context = {
            req: mockRequest("bearer foobar-valid-jwt"),
            res: mockResponse(),
            container,
        };

        // act
        const result = resolver.me(context);

        // assert
        await expect(result).rejects.toThrowError("jwt malformed");
    });

    test("blank authorization token returns null", async () => {
        // act
        const result = await resolver.me(context);

        // assert
        expect(result).toBeNull();
    });
});