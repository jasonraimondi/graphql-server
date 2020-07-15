import jwtDecode from "jwt-decode";

import { Role } from "../../../entity/role/role_entity";
import { User } from "../../../entity/user/user_entity";
import { Permission } from "../../../entity/role/permission_entity";
import { REPOSITORY, SERVICE } from "../../constants/inversify";
import { ForgotPassword } from "../../../entity/user/forgot_password_entity";
import { EmailConfirmation } from "../../../entity/user/email_confirmation_entity";
import { TestingContainer } from "../../../../test/test_container";
import { AuthService } from "./auth_service";
import { IUserRepository } from "../../repository/user/user_repository";

describe("auth_resolver", () => {
  const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

  let container: TestingContainer;
  let authService: AuthService;
  let userRepository: IUserRepository;

  beforeEach(async () => {
    container = await TestingContainer.create(entities);
    authService = container.get(SERVICE.AuthService);
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
  });

  describe("refreshToken", () => {
    test("create refresh token no remember me", async () => {
      // arrange
      const user = await User.create({ email: "jason@raimondi.us" });
      await userRepository.save(user);
      const hoursInFuture = (hours: number) => Date.now() / 1000 + 60 * 60 * hours;

      // act
      const token = authService.createRefreshToken(user);
      const decoded: any = jwtDecode(token);

      // assert
      expect(decoded.userId).toBe(user.id);
      expect(decoded.tokenVersion).toBe(user.tokenVersion);
      expect(decoded.exp).toBeGreaterThan(hoursInFuture(1.9));
      expect(decoded.exp).toBeLessThan(hoursInFuture(2.1));
    });

    test("create refresh token with remember me", async () => {
      // arrange
      const rememberMe = true;
      const user = await User.create({ email: "jason@raimondi.us" });
      await userRepository.save(user);
      const daysInFuture = (days: number) => Date.now() / 1000 + 60 * 60 * 24 * days;

      // act
      const token = authService.createRefreshToken(user, rememberMe);
      const decoded: any = jwtDecode(token);

      // assert
      expect(decoded.userId).toBe(user.id);
      expect(decoded.tokenVersion).toBe(user.tokenVersion);
      expect(decoded.exp).toBeGreaterThan(daysInFuture(6.9));
      expect(decoded.exp).toBeLessThan(daysInFuture(7.1));
    });

    test("create access token", async () => {
      // arrange
      const user = await User.create({ email: "jason@raimondi.us" });
      await userRepository.save(user);
      const minutesInFuture = (minutes: number) => Date.now() / 1000 + 60 * minutes;

      // act
      const token = authService.createAccessToken(user);
      const decoded: any = jwtDecode(token);

      // assert
      expect(decoded.userId).toBe(user.id);
      expect(decoded.exp).toBeGreaterThan(minutesInFuture(14));
      expect(decoded.exp).toBeLessThan(minutesInFuture(16));
    });

    test("invalid jwt throws exception", async () => {
      // arrange
      const result = authService.updateAccessToken("not-a-jwt");
      // assert
      await expect(result).rejects.toThrowError("invalid refresh token");
    });
  });
});
