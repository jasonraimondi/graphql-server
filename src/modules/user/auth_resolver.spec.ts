import jwtDecode from "jwt-decode";

import { Role } from "@/entity/role_entity";
import { User } from "@/entity/user_entity";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { Permission } from "@/entity/permission_entity";
import { AuthResolver } from "@/modules/user/auth_resolver";
import { REPOSITORY } from "@/lib/constants/inversify";
import { ForgotPassword } from "@/entity/forgot_password_entity";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { LoginInput } from "@/modules/user/auth/login_input";
import { MyContext } from "@/lib/types/my_context";


export const mockRequest = (authHeader?: string, sessionData?: any) => ({
    get(name: string) {
        if (name === "authorization") return authHeader;
        return null;
    },
    cookie: jest.fn().mockReturnValue({
        authorization: "bearer iamacookie"
    }),
    session: {data: sessionData},
});

export const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe("auth_resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let userRepository: UserRepository;
    let context: MyContext;
    let resolver: AuthResolver;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        userRepository = container.get<UserRepository>(REPOSITORY.UserRepository);
        context = {
            res: mockRequest(),
            req: mockResponse(),
            container,
        };
        resolver = container.get(AuthResolver);
    });

    describe("login", () => {
        test("user logs in successfully", async () => {
            // arrange
            const input = new LoginInput();
            input.email = "jason@raimondi.us";
            input.password = "jasonraimondi";
            const user = await User.create(input);
            user.isEmailConfirmed = true;
            await userRepository.save(user);


            // act
            const result = await resolver.login(input, context);


            // assert
            const decode = jwtDecode<any>(result.accessToken);
            expect(decode.userId).toBe(user.uuid);
            expect(result.user.uuid).toBe(user.uuid);
            expect(result.user.email).toBe(user.email);
        });

        test("user without password throws error", async () => {
            // arrange
            await userRepository.save(await User.create({email: "jason@raimondi.us"}));
            const input = new LoginInput();
            input.email = "jason@raimondi.us";
            input.password = "jasonraimondi";

            // act
            const result = resolver.login(input, context);
            const result1 = resolver.login({
                ...input,
                email: "email@not_found.com",
            }, context);

            // assert
            await expect(result).rejects.toThrowError("user must create password");
            await expect(result1).rejects.toThrowError(new RegExp('Could not find any entity of type "User"'));
        });
    });

    describe("revokeRefreshToken", () => {
        test("fails for invalid user", async () => {
            // arrange
            const unsavedUser = await User.create({email: "control_user@example.com"});

            // act
            const result = await resolver.revokeRefreshToken(unsavedUser.uuid);

            // assert
            expect(result).toBeFalsy();
            expect(unsavedUser.tokenVersion).toBe(0);
        });

        test("increments the user token version", async () => {
            // arrange
            const user = await User.create({email: "jason@raimondi.us"});
            await userRepository.save(user);

            // act
            const result = await resolver.revokeRefreshToken(user.uuid);

            // assert
            const updatedUser = await userRepository.findByEmail(user.email);
            expect(result).toBeTruthy();
            expect(updatedUser.tokenVersion).toBe(1);
        });
    });
});