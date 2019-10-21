import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { User } from "@/entity/user_entity";
import { Role } from "@/entity/role_entity";
import { ForgotPassword } from "@/entity/forgot_password_entity";
import { Permission } from "@/entity/permission_entity";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";
import { UserResolver } from "@/modules/user/user_resolver";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { REPOSITORY } from "@/lib/constants/inversify";

describe("register_resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingInversifyContainer;
    let userRepository: UserRepository;

    beforeEach(async () => {
        container = await TestingInversifyContainer.create(entities);
        userRepository = container.get<UserRepository>(REPOSITORY.UserRepository);
    });

    describe("user", () => {
        test("resolve user by uuid", async () => {
            // arrange
            const resolver = container.get<UserResolver>(UserResolver);
            const user = await userRepository.save(User.create({ email: "jason@raimondi.us" }));

            // act
            const result = await resolver.user(user.uuid);

            // assert
            expect(result.uuid).toBe(user.uuid);
            expect(result.email).toBe(user.email);
            expect(result.firstName).toBe(user.firstName);
        });
    });

    describe("users", () => {
        test("resolve list users", async () => {
            // arrange
            const resolver = container.get<UserResolver>(UserResolver);
            await userRepository.save(User.create({ email: "jason@raimondi.us" }));
            await userRepository.save(User.create({ email: "jason1@raimondi.us" }));

            // act
            const result = await resolver.users();

            // assert
            expect(result.length).toBe(2);
        });
    });
});