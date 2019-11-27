import { Container as InversifyContainer, interfaces } from "inversify";

import { AuthResolver } from "../modules/user/auth_resolver";
import { AppResolver } from "../modules/app/app_resolver";
import { ForgotPasswordResolver } from "../modules/user/forgot_password_resolver";
import { MeResolver } from "../modules/user/me_resolver";
import { UserResolver } from "../modules/user/user_resolver";
import { RepositoryFactory } from "./repository/repository_factory";
import { ForgotPasswordEmail } from "./services/email/user/forgot_password_email";
import { ServiceFactory } from "./services/service_factory";
import { EmailConfirmationResolver } from "../modules/user/email_confirmation_resolver";
import { RegisterResolver } from "../modules/user/register_resolver";
import { RegisterEmail } from "./services/email/user/register_email";
import { IEmailConfirmationRepository } from "./repository/user/email_confirmation_repository";
import { IUserRepository } from "./repository/user/user_repository";
import { IForgotPasswordRepository } from "./repository/user/forgot_password_repository";
import { REPOSITORY, SERVICE } from "./constants/inversify";
import { IMailer } from "./services/email/mailer";
import { AuthService } from "./services/auth/auth_service";

export class Container extends InversifyContainer {
    public constructor(
        protected readonly repositoryFactory: RepositoryFactory,
        protected readonly serviceFactory: ServiceFactory,
        containerOptions?: interfaces.ContainerOptions,
    ) {
        super(containerOptions);
        this.bindContainer();
    }

    protected bindContainer(): void {
        // app resolvers
        this.bind(AppResolver).toSelf();
        this.bind(AuthResolver).toSelf();
        this.bind(ForgotPasswordResolver).toSelf();
        this.bind(MeResolver).toSelf();
        this.bind(RegisterResolver).toSelf();
        this.bind(EmailConfirmationResolver).toSelf();
        this.bind(UserResolver).toSelf();

        // services
        this.bind<IMailer>(SERVICE.Mailer).toConstantValue(this.serviceFactory.emailService);
        this.bind<AuthService>(SERVICE.AuthService).to(AuthService);

        // emails
        this.bind<ForgotPasswordEmail>(SERVICE.ForgotPasswordEmail).to(ForgotPasswordEmail);
        this.bind<RegisterEmail>(SERVICE.RegisterEmail).to(RegisterEmail);

        // repositories
        this.bind<IForgotPasswordRepository>(REPOSITORY.ForgotPasswordRepository).toConstantValue(this.repositoryFactory.forgotPassword);
        this.bind<IUserRepository>(REPOSITORY.UserRepository).toConstantValue(this.repositoryFactory.user);
        this.bind<IEmailConfirmationRepository>(REPOSITORY.EmailConfirmationRepository).toConstantValue(this.repositoryFactory.emailConfirmation);
    }
}
