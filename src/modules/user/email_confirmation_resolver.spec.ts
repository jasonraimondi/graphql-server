import { User } from "@/entity/user/user_entity";
import { ForgotPassword } from "@/entity/user/forgot_password_entity";
import { Role } from "@/entity/role/role_entity";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { Permission } from "@/entity/role/permission_entity";
import { REPOSITORY } from "@/lib/constants/inversify";
import { EmailConfirmation } from "@/entity/user/email_confirmation_entity";
import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { EmailConfirmationResolver } from "@/modules/user/email_confirmation_resolver";
import { EmailConfirmationRepository } from "@/lib/repository/user/email_confirmation_repository";
import { VerifyEmailInput } from "@/modules/user/auth/verify_email_input";

describe("email confirmation resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let resolver: EmailConfirmationResolver;
    let userRepository: UserRepository;
    let emailConfirmationRepository: EmailConfirmationRepository;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        userRepository = container.get(REPOSITORY.UserRepository);
        emailConfirmationRepository = container.get(REPOSITORY.EmailConfirmationRepository);
        resolver = container.get(EmailConfirmationResolver);
    });

    describe("verify user email confirmation", () => {
        test("resolve user by uuid", async () => {
            // arrange
            const user = await userRepository.save(await User.create({email: "jason@raimondi.us"}));
            const emailConfirmation = await emailConfirmationRepository.save(new EmailConfirmation(user));


            // act
            const input = new VerifyEmailInput();
            input.uuid = emailConfirmation.uuid;
            input.email = user.email;
            await resolver.verifyEmailConfirmation(input);
            const result = emailConfirmationRepository.findByEmail(user.email);

            // assert
            await expect(result).rejects.toThrowError('Could not find any entity of type "EmailConfirmation"');
        });
    });
});