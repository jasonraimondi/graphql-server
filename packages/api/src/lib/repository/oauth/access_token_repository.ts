import { injectable } from "inversify";
import { EntityRepository, Repository } from "typeorm";

import { IBaseRepository } from "@/lib/repository/base_repository";
import { AccessToken } from "@/entity/oauth/access_token_entity";

export interface IAccessTokenRepository extends IBaseRepository<AccessToken> {
}

@injectable()
@EntityRepository(AccessToken)
export class AccessTokenRepository extends Repository<AccessToken> implements IAccessTokenRepository {
  findById(uuid: string) {
    return this.findOneOrFail(uuid);
  }
}
