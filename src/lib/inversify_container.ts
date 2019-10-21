import { Container, interfaces } from "inversify";

import { AuthResolver } from "@/modules/user/auth_resolver";
import { AppResolver } from "@/modules/app/app_resolver";
import { ForgotPasswordResolver } from "@/modules/user/forgot_password_resolver";
import { MeResolver } from "@/modules/user/me_resolver";
import { UserResolver } from "@/modules/user/user_resolver";
import { RepositoryFactory} from "@/lib/repository/repository_factory";
import { ForgotPasswordEmail } from "@/lib/services/email/user/forgot_password_email";
import { ServiceFactory } from "@/lib/services/service_factory";
import { EmailConfirmationResolver } from "@/modules/user/email_confirmation_resolver";
import { RegisterResolver } from "@/modules/user/register_resolver";
import { RegisterEmail } from "@/lib/services/email/user/register_email";
import { EmailConfirmationRepository } from "@/lib/repository/user/email_confirmation_repository";
import { UserRepository } from "@/lib/repository/user/user_repository";
import { ForgotPasswordRepository } from "@/lib/repository/user/forgot_password_repository";
import { REPOSITORY, SERVICE } from "@/lib/constants/inversify";
import { IMailer } from "@/lib/services/email/mailer";

export class InversifyContainer extends Container {
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
        this.bind<ForgotPasswordEmail>(SERVICE.ForgotPasswordEmail).to(ForgotPasswordEmail);
        this.bind<RegisterEmail>(SERVICE.RegisterEmail).to(RegisterEmail);

        // repositories
        this.bind<ForgotPasswordRepository>(REPOSITORY.ForgotPasswordRepository).toConstantValue(this.repositoryFactory.forgotPassword);
        this.bind<UserRepository>(REPOSITORY.UserRepository).toConstantValue(this.repositoryFactory.user);
        this.bind<EmailConfirmationRepository>(REPOSITORY.EmailConfirmationRepository).toConstantValue(this.repositoryFactory.emailConfirmation);
    }
}