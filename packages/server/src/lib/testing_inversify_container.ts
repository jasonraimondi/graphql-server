import { ConnectionOptions, createConnection } from "typeorm";
import { interfaces } from "inversify";

import { InversifyContainer } from "@/lib/inversify_container";
import { RepositoryFactory } from "@/lib/repository/repository_factory";
import { ServiceFactory } from "@/lib/services/service_factory";
import { TestingServiceFactory } from "@/lib/services/testing_service_factory";

export class TestingInversifyContainer extends InversifyContainer {
    private constructor(
        protected readonly repositoryFactory: RepositoryFactory,
        protected readonly serviceFactory: ServiceFactory,
        containerOptions?: interfaces.ContainerOptions,
    ) {
        super(repositoryFactory, serviceFactory, containerOptions);
        this.rebindContainer();
    }

    static async create(options: ConnectionOptions = {
        type: "sqlite",
        database: ":memory:",
    }) {
        const repositoryFactory = new RepositoryFactory(await createConnection(options));
        const serviceFactory = new TestingServiceFactory();
        return new TestingInversifyContainer(
            repositoryFactory,
            serviceFactory,
        );
    }

    protected rebindContainer(): void {
    }
}
