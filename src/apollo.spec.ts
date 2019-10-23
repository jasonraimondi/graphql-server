import { TestingInversifyContainer } from "@/lib/testing_inversify_container";
import { initializeApolloServer } from "@/apollo";
import { User } from "@/entity/user_entity";
import { Role } from "@/entity/role_entity";
import { Permission } from "@/entity/permission_entity";
import { ForgotPassword } from "@/entity/forgot_password_entity";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";

describe("apollo server", () => {
    test("boots and has endpoint", async () => {
        const entities = [User, Role, Permission, ForgotPassword, EmailConfirmation];
        const container = await TestingInversifyContainer.create(entities);
        const apollo = await initializeApolloServer(container);

        expect(apollo.graphqlPath).toBe("/graphql");
    });
});
