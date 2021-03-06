import jwtDecode from "jwt-decode";

import { Permission } from "../../entity/role/permission_entity";
import { Role } from "../../entity/role/role_entity";
import { EmailConfirmation } from "../../entity/user/email_confirmation_entity";
import { ForgotPassword } from "../../entity/user/forgot_password_entity";
import { User } from "../../entity/user/user_entity";
import { REPOSITORY } from "../../lib/constants/inversify";
import { IUserRepository } from "../../lib/repository/user/user_repository";
import { TestingContainer } from "../../../test/test_container";
import { MyContext } from "../../lib/types/my_context";
import { LoginInput } from "./auth/login_input";
import { AuthResolver } from "./auth_resolver";
import { mockRequest, mockResponse } from "../../../test/mock_application";

describe("auth_resolver", () => {
  const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

  let container: TestingContainer;
  let userRepository: IUserRepository;
  let context: MyContext;
  let resolver: AuthResolver;

  beforeEach(async () => {
    container = await TestingContainer.create(entities);
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
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
      input.email = "jason@Raimondi.us";
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
      await userRepository.save(await User.create({ email: "jason@raimondi.us" }));
      const input = new LoginInput();
      input.email = "jason@raimondi.us";
      input.password = "non-existant-password";

      // act
      const result = resolver.login(input, context);

      // assert
      await expect(result).rejects.toThrowError("user must create password");
    });

    test("non existant user throws", async () => {
      // arrange
      const input = new LoginInput();
      input.email = "email@notfound.com";
      input.password = "thisuserdoesntexist";

      // act
      const result = resolver.login(input, context);

      // assert
      await expect(result).rejects.toThrowError(new RegExp('Could not find any entity of type "User"'));
    });
  });

  describe("revokeRefreshToken", () => {
    test("fails for invalid user", async () => {
      // arrange
      const unsavedUser = await User.create({
        email: "control_user@example.com",
      });

      // act
      const result = await resolver.revokeRefreshToken(unsavedUser.uuid);

      // assert
      expect(result).toBeFalsy();
      expect(unsavedUser.tokenVersion).toBe(0);
    });

    test("increments the user token version", async () => {
      // arrange
      const user = await User.create({ email: "jason@raimondi.us" });
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
