import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { createConnection } from "typeorm";

import { ENV } from "@/lib/constants/config";
import { ServiceFactory } from "@/lib/services/service_factory";
import { RepositoryFactory } from "@/lib/repository/repository_factory";
import { Container } from "@/lib/inversify_container";
import { IUserRepository } from "@/lib/repository/user/user_repository";
import { REPOSITORY } from "@/lib/constants/inversify";
import { User } from "@/entity/user/user_entity";
import { IClientRepository } from "@/lib/repository/oauth/client_repository";
import { Client } from "@/entity/oauth/client_entity";

(async () => {
  if (ENV.enableDebugging) {
    console.log("DEBUGGING ENABLED");
  }

  const repositoryFactory = new RepositoryFactory(await createConnection());
  const serviceFactory = new ServiceFactory(ENV.mailerURL);
  const container = new Container(repositoryFactory, serviceFactory);

  const userRepository = container.get<IUserRepository>(REPOSITORY.UserRepository);
  const clientRepository = container.get<IClientRepository>(REPOSITORY.ClientRepository);

  await userRepository.save(await User.create({ email: "jason@raimondi.us", password: "jasonraimondi1" }));
  await clientRepository.save(new Client("Jasons Test Client"));

})().catch(e => console.error(e));