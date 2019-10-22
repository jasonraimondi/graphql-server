import jwtDecode from "jwt-decode";

import { Role } from "@/entity/role_entity";
import { User } from "@/entity/user_entity";
import { Permission } from "@/entity/permission_entity";
import { REPOSITORY, SERVICE } from "@/lib/constants/inversify";
import { ForgotPassword } from "@/entity/forgot_password_entity";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { AuthService } from "@/lib/services/auth/auth_service";
import { UserRepository } from "@/lib/repository/user/user_repository";

describe("auth_resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let authService: AuthService;
    let userRepository: UserRepository;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        authService = container.get(SERVICE.AuthService);
        userRepository = container.get<UserRepository>(REPOSITORY.UserRepository);
    });

    describe("refreshToken", () => {

        test("create refresh token is created with expected data", async () => {
            // arrange
            const user = await userRepository.save(await User.create({ email: "jason@raimondi.us", }));
            const daysInFuture = (days: number) => Date.now() / 1000 + 60 * 60 * 24 * days;

            // act
            const token = authService.createRefreshToken(user);
            const decoded: any = jwtDecode(token);

            // assert
            expect(decoded.userId).toBe(user.uuid);
            expect(decoded.exp).toBeGreaterThan(daysInFuture(6));
            expect(decoded.exp).toBeLessThan(daysInFuture(8));
        });

        test("create access token is created with expected data", async () => {
            // arrange
            const user = await userRepository.save(await User.create({ email: "jason@raimondi.us", }));
            const minutesInFuture = (minutes: number) => Date.now() / 1000 + 60 * minutes;

            // act
            const token = authService.createAccessToken(user);
            const decoded: any = jwtDecode(token);

            // assert
            expect(decoded.userId).toBe(user.uuid);
            expect(decoded.exp).toBeGreaterThan(minutesInFuture(14));
            expect(decoded.exp).toBeLessThan(minutesInFuture(16));
        });


        test("invalid jwt throws exception", async () => {
            // arrange
            const result = authService.refreshToken("not-a-jwt");
            // assert
            await expect(result).rejects.toThrowError("invalid token");
        });
    });
});