import { injectable } from "inversify";
import { EntityRepository, Repository } from "typeorm";

import { IBaseRepository } from "@/lib/repository/base_repository";
import { Client } from "@/entity/oauth/client_entity";

export interface IClientRepository extends IBaseRepository<Client> {
}

@injectable()
@EntityRepository(Client)
export class ClientRepository extends Repository<Client> implements IClientRepository {
  findById(uuid: string) {
    return this.findOneOrFail(uuid);
  }
}
