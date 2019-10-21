import { User } from "@/entity/user_entity";
import { ForgotPassword } from "@/entity/forgot_password_entity";
import { Role } from "@/entity/role_entity";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { Permission } from "@/entity/permission_entity";
import { REPOSITORY } from "@/lib/constants/inversify";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import {ForgotPasswordRepository} from "@/lib/repository/user/forgot_password_repository";
import {ForgotPasswordResolver} from "@/modules/user/forgot_password_resolver";
import {SendForgotPasswordInput, UpdatePasswordInput} from "@/modules/user/auth/forgot_password_input";

describe("forgot password resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let resolver: ForgotPasswordResolver;
    let userRepository: UserRepository;
    let forgotPasswordRepository: ForgotPasswordRepository;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        userRepository = container.get(REPOSITORY.UserRepository);
        forgotPasswordRepository = container.get(REPOSITORY.ForgotPasswordRepository);
        resolver = container.get(ForgotPasswordResolver);
    });

    describe("sendForgotPasswordEmail", () => {
        test("success", async () => {
            // arrange
            const user = await User.create({email: "jason@raimondi.us"});
            user.isEmailConfirmed = true;
            await userRepository.save(user);


            // act
            const input = new SendForgotPasswordInput();
            input.email = user.email;
            await resolver.sendForgotPasswordEmail(input);


            // assert
            const updatedForgotPassword = await forgotPasswordRepository.findForUser(user.uuid);
            expect(updatedForgotPassword.expiresAt.getTime()).toBeGreaterThan(Date.now());
        });
    });

    describe("updatePasswordFromToken", () => {
        test("success", async () => {
            // arrange
            const user = await User.create({email: "jason@raimondi.us"});
            user.isEmailConfirmed = true;
            await userRepository.save(user);
            const forgotPassword = await forgotPasswordRepository.save(new ForgotPassword(undefined, user));


            // act
            const input = new UpdatePasswordInput();
            input.token = forgotPassword.uuid;
            input.email = user.email;
            input.password = "my-new-password";
            await resolver.updatePasswordFromToken(input);


            // assert
            const updatedUser = await userRepository.findById(user.uuid);
            await expect(updatedUser.verify("my-new-password")).resolves.toBeUndefined();
            await expect(forgotPasswordRepository.findForUser(forgotPassword.uuid)).rejects.toThrowError('Could not find any entity of type "ForgotPassword"');
        });
    });
});