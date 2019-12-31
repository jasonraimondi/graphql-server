import request from "supertest";

import { Role } from "../entity/role/role_entity";
import { User } from "../entity/user/user_entity";
import { AuthService } from "../lib/services/auth/auth_service";
import { Permission } from "../entity/role/permission_entity";
import { IUserRepository } from "../lib/repository/user/user_repository";
import { REPOSITORY, SERVICE } from "../lib/constants/inversify";
import { ForgotPassword } from "../entity/user/forgot_password_entity";
import { EmailConfirmation } from "../entity/user/email_confirmation_entity";
import { TestingContainer } from "../../test/test_container";
import { application } from "../lib/express";

describe("auth controller", () => {
  const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

  let container: TestingContainer;
  let userRepository: IUserRepository;
  let authService: AuthService;

  beforeEach(async () => {
    await import("./auth_controller");

    container = await TestingContainer.create(entities);
    userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    authService = container.get<AuthService>(SERVICE.AuthService);
  });

  test("refresh token updates successfully", async () => {
    // arrange
    const app = await application(container);

    const user = await User.create({ email: "jason@raimondi.us" });
    await userRepository.save(user);
    const refreshToken = authService.createRefreshToken(user);

    // act
    const response = await request(app)
      .post("/auth/refresh_token")
      .expect(200)
      .set("Cookie", [`jid=${refreshToken}`, `rememberMe=true`])
      .expect("Content-Type", /json/);

    // assert
    expect(response.header["set-cookie"].length).toBe(2);
    expect(response.header["set-cookie"][0]).toMatch(/rememberMe=true*/);
    const REFRESH_COOKIE = /jid=[a-zA-Z\d\-_]+.[a-zA-Z\d\-_]+.[a-zA-Z\d\-_]+; Domain=localhost; Path=\/;/;
    expect(response.header["set-cookie"][1]).toMatch(REFRESH_COOKIE);
    expect(response.body.success).toBe(true);
    expect(response.body.accessToken).toMatch(/[a-zA-Z\d]+.[a-zA-Z\d]+.[a-zA-Z\d]+/);
  });

  test("refresh token no remember me", async () => {
    // arrange
    const app = await application(container);

    const user = await User.create({ email: "jason@raimondi.us" });
    await userRepository.save(user);
    const refreshToken = authService.createRefreshToken(user);

    // act
    const response = await request(app)
      .post("/auth/refresh_token")
      .expect(200)
      .set("Cookie", [`jid=${refreshToken}`])
      .expect("Content-Type", /json/);

    // assert
    expect(response.header["set-cookie"][0]).toMatch(/rememberMe=false*/);
  });

  test("missing token (jid) fails", async () => {
    // arrange
    const app = await application(container);

    // act
    const response = await request(app)
      .post("/auth/refresh_token")
      .expect(401)
      .expect("Content-Type", /json/);

    // assert
    expect(response.header["set-cookie"]).toBeUndefined();
    expect(response.body.success).toBe(false);
    expect(response.body.accessToken).toBe("");
  });

  test("invalid token (jid) fails", async () => {
    const app = await application(container);

    // arrange
    const invalidToken = "invalid-token";

    // act
    const response = await request(app)
      .post("/auth/refresh_token")
      .expect(401)
      .set("Cookie", [`jid=${invalidToken}`])
      .expect("Content-Type", /json/);

    // assert
    expect(response.header["set-cookie"]).toBeUndefined();
    expect(response.body.success).toBe(false);
    expect(response.body.accessToken).toBe("");
  });
});
