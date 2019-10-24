import { TestingContainer } from "@test/test_container";
import { User } from "@/entity/user/user_entity";
import { Role } from "@/entity/role/role_entity";
import { ForgotPassword } from "@/entity/user/forgot_password_entity";
import { Permission } from "@/entity/role/permission_entity";
import { EmailConfirmation } from "@/entity/user/email_confirmation_entity";
import { UserResolver } from "@/modules/user/user_resolver";
import { IUserRepository } from "@/lib/repository/user/user_repository";
import { REPOSITORY } from "@/lib/constants/inversify";

describe("register_resolver", () => {
    const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];

    let container: TestingContainer;
    let userRepository: IUserRepository;

    beforeEach(async () => {
        container = await TestingContainer.create(entities);
        userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
    });

    describe("user", () => {
        test("resolve user by uuid", async () => {
            // arrange
            const resolver = container.get<UserResolver>(UserResolver);
            const user = await User.create({ email: "jason@raimondi.us" });
            await userRepository.save(user);

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
            await userRepository.save(await User.create({ email: "jason@raimondi.us" }));
            await userRepository.save(await User.create({ email: "jason1@raimondi.us" }));

            // act
            const result = await resolver.users();

            // assert
            expect(result.length).toBe(2);
        });
    });
});