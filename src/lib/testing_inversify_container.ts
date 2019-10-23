import { createConnection } from "typeorm";
import { interfaces } from "inversify";
import v4 from "uuid/v4";

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

    static async create(entities: any[] = [], logging = false) {
        const connection = await createConnection({
            name: v4(),
            type: "sqlite",
            database: ":memory:",
            logging,
            synchronize: entities.length > 0,
            entities
        });
        const repositoryFactory = new RepositoryFactory(connection);
        const serviceFactory = new TestingServiceFactory();
        return new TestingInversifyContainer(
            repositoryFactory,
            serviceFactory,
        );
    }

    protected rebindContainer(): void {
    }
}
