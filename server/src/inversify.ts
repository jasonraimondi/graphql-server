import { Container as InversifyContainer, interfaces } from "inversify";

import { AuthResolver } from "@/modules/user/auth_resolver";
import { AppResolver } from "@/modules/app/app_resolver";
import { ForgotPasswordResolver } from "@/modules/user/forgot_password_resolver";
import { MeResolver } from "@/modules/user/me_resolver";
import { UserResolver } from "@/modules/user/user_resolver";
import { RepositoryFactory, TYPES } from "@/modules/repository/repository_factory";
import { ForgotPasswordEmail } from "@/services/email/forgot_password/forgot_password_email";
import { UserRepository } from "@/modules/repository/user_repository";
import { ServiceFactory } from "@/services/service_factory";
import { EmailService } from "@/services/email/email_service";

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
        this.bind(AuthResolver).toSelf();
        this.bind(AppResolver).toSelf();
        this.bind(ForgotPasswordResolver).toSelf();
        this.bind(MeResolver).toSelf();
        this.bind(UserResolver).toSelf();

        this.bind<EmailService>(TYPES.EmailService).toConstantValue(this.serviceFactory.emailService);
        this.bind<ForgotPasswordEmail>(TYPES.ForgotPasswordEmail).to(ForgotPasswordEmail);
        this.bind<UserRepository>(TYPES.UserRepository).toConstantValue(this.repositoryFactory.userRepository);
    }
}