import { injectable } from "inversify";
import { EntityRepository, Repository } from "typeorm";

import { IBaseRepository } from "@/lib/repository/base_repository";
import { AuthorizationCode } from "@/entity/oauth/authorization_code_entity";

export interface IAuthorizationCodeRepository extends IBaseRepository<AuthorizationCode> {
}

@injectable()
@EntityRepository(AuthorizationCode)
export class AuthorizationCodeRepository extends Repository<AuthorizationCode> implements IAuthorizationCodeRepository {
  findById(uuid: string) {
    return this.findOneOrFail(uuid);
  }
}
