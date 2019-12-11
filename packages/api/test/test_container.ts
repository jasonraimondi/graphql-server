import { createConnection } from "typeorm";
import { interfaces } from "inversify";
import v4 from "uuid/v4";

import { Container } from "../src/lib/inversify_container";
import { ServiceFactory } from "../src/lib/services/service_factory";
import { TestingServiceFactory } from "../src/lib/services/testing_service_factory";
import { RepositoryFactory } from "../src/lib/repository/repository_factory";
import { ENV } from "../src/lib/constants/config";

export class TestingContainer extends Container {
  private constructor(
    protected readonly repositoryFactory: RepositoryFactory,
    protected readonly serviceFactory: ServiceFactory,
    containerOptions?: interfaces.ContainerOptions
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
      entities,
    });
    const repositoryFactory = new RepositoryFactory(connection);
    const serviceFactory = new TestingServiceFactory(ENV.mailerURL);
    return new TestingContainer(repositoryFactory, serviceFactory);
  }

  protected rebindContainer(): void {}
}
