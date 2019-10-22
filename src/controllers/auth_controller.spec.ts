import request from "supertest";

import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { User } from "@/entity/user_entity";
import { Role } from "@/entity/role_entity";
import { Permission } from "@/entity/permission_entity";
import { ForgotPassword } from "@/entity/forgot_password_entity";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { REPOSITORY, SERVICE } from "@/lib/constants/inversify";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { AuthService } from "@/lib/services/auth/auth_service";
import { application } from "@/app";

describe("auth controller", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let userRepository: UserRepository;
    let authService: AuthService;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        userRepository = container.get<UserRepository>(REPOSITORY.UserRepository);
        authService = container.get<AuthService>(SERVICE.AuthService);
    });

    test("refresh token updates successfully", async () => {
        // arrange
        const app = await application(container, ["./controllers/auth_controller"]);

        const user = await userRepository.save(await User.create({ email: "jason@raimondi.us", }));
        const refreshToken = authService.createRefreshToken(user);

        // act
        const response = await request(app)
            .post("/auth/refresh_token")
            .expect(200)
            .set("Cookie", [`jid=${refreshToken}`])
            .expect("Content-Type", /json/);

        // assert
        expect(response.header["set-cookie"].length).toBe(1);
        let JID_JWT_ = /jid=[a-zA-Z\d\-_]+.[a-zA-Z\d\-_]+.[a-zA-Z\d\-_]+; Path=\/refresh_token; HttpOnly/;
        expect(response.header["set-cookie"][0]).toMatch(JID_JWT_);
        // expect(response.header["set-cookie"][0].includes(refreshToken)).toBeFalsy();
        expect(response.body.success).toBe(true);
        expect(response.body.accessToken).toMatch(/[a-zA-Z\d]+.[a-zA-Z\d]+.[a-zA-Z\d]+/);
    });


    test("missing token (jid) fails", async () => {
        // arrange
        const app = await application(container, ["./controllers/auth_controller"]);

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
        const app = await application(container, ["./controllers/auth_controller"]);

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
