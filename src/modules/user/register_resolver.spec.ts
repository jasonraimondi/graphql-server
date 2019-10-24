import { validate } from "class-validator";

import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { User } from "@/entity/user/user_entity";
import { Role } from "@/entity/role/role_entity";
import { ForgotPassword } from "@/entity/user/forgot_password_entity";
import { Permission } from "@/entity/role/permission_entity";
import { EmailConfirmation } from "@/entity/user/email_confirmation_entity";
import { RegisterResolver } from "@/modules/user/register_resolver";
import { RegisterInput } from "@/modules/user/auth/register_input";
import { REPOSITORY } from "@/lib/constants/inversify";
import { EmailConfirmationRepository } from "@/lib/repository/user/email_confirmation_repository";
import { IUserRepository } from "@/lib/repository/user/user_repository";

describe("register_resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let userRepository: IUserRepository;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    });

    describe("register function", () => {
        test("valid register input is validated correctly", async () => {
            // arrange
            const validInput = new RegisterInput();
            validInput.email = "jason@raimondi.us";

            // act
            const validationErrors = await validate(validInput);

            // assert
            expect(validationErrors.length).toBe(0);
        });

        test("invalid register input has errors thrown", async () => {
            // arrange
            const validInput = new RegisterInput();
            validInput.email = "jason@raimondi";

            // act
            const validationErrors = await validate(validInput);

            // assert
            expect(validationErrors.length).toBe(1);
        });

        test("duplicate user uuid is denied", async () => {
            // arrange
            const resolver = container.get<RegisterResolver>(RegisterResolver);
            const input = new RegisterInput();
            input.uuid = "b031765a-a950-4a0d-92dd-ecd12788f3a6n";
            input.email = "jason@raimondi.us";
            await userRepository.save(await User.create(input));

            // act
            const result = resolver.register(input);

            // assert
            await expect(result).rejects.toThrowError("duplicate uuid for user");
        });

        test("duplicate user email is denied", async () => {
            // arrange
            const resolver = container.get<RegisterResolver>(RegisterResolver);
            const input = new RegisterInput();
            input.email = "jason@raimondi.us";
            await userRepository.save(await User.create(input));

            // act
            const result = resolver.register(input);

            // assert
            await expect(result).rejects.toThrowError("duplicate email for user");
        });

        test("user is registered with email confirmation", async () => {
            // arrange
            const resolver = container.get<RegisterResolver>(RegisterResolver);
            const input = new RegisterInput();
            input.email = "jason@raimondi.us";

            // act
            const result = await resolver.register(input);

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

    describe("resentConfirmEmail", () => {
        test("resend email function works", async () => {
            // arrange
            const resolver = container.get<RegisterResolver>(RegisterResolver);
            const input = new RegisterInput();
            input.email = "jason@raimondi.us";
            await resolver.register(input);

            // act
            const result = await resolver.resentConfirmEmail("jason@raimondi.us");

            // assert
            expect(result).toBe(true);
        });

        test("resend email throws for invalid user", async () => {
            // arrange
            const resolver = container.get<RegisterResolver>(RegisterResolver);

            // act
            const result = resolver.resentConfirmEmail("jason@raimondi.us");

            // assert
            await expect(result).rejects.toThrow(new RegExp('Could not find any entity of type "EmailConfirmation"'));
        });
    });
});