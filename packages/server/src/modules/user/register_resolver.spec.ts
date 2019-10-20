import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { User } from "@/entity/user_entity";
import { Role } from "@/entity/role_entity";
import { ForgotPassword } from "@/entity/forgot_password_entity";
import { Permission } from "@/entity/permission_entity";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { RegisterResolver } from "@/modules/user/register_resolver";
import { RegisterInput } from "@/modules/user/auth/register_input";
import { REPOSITORY } from "@/lib/constants/inversify";
import { EmailConfirmationRepository } from "@/lib/repository/user/email_confirmation_repository";
import { validate } from "class-validator";

describe("register_resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    test("valid register input is validated correctly", async () => {
        // arrange
        const validInput =new RegisterInput();
        validInput.email = "jason@raimondi";

        // act
        const validationErrors = await validate(validInput);

        // assert
        expect(validationErrors.length).toBe(1);
    });

    test("invalid register input has errors thrown", async () => {
        // arrange
        const validInput =new RegisterInput();
        validInput.email = "jason@raimondi";

        // act
        const validationErrors = await validate(validInput);

        // assert
        expect(validationErrors.length).toBe(1);
    });

    test("user is registered with email confirmation", async () => {
        // arrange
        const container = await TestingInversifyContainer.create(entities);
        const registerResolver = container.get<RegisterResolver>(RegisterResolver);
        const registerInput =new RegisterInput();
        registerInput.email = "jason@raimondi.us";

        // act
        const result = await registerResolver.register(registerInput);

        // assert
        const emailConfirmationRepository = container.get<EmailConfirmationRepository>(REPOSITORY.EmailConfirmationRepository);
        const emailConfirmation = await emailConfirmationRepository.findByEmail("jason@raimondi.us");
        expect(result.userConfirmation).toBeTruthy();
        expect(result.userConfirmation!.uuid).toBe(emailConfirmation.uuid);
        expect(result.user).toBeTruthy();
        expect(result.user!.uuid).toBe(emailConfirmation.user.uuid);
        expect(result.user!.email).toBe("jason@raimondi.us");
        expect(result.user!.isEmailConfirmed).toBeFalsy();
    });
});