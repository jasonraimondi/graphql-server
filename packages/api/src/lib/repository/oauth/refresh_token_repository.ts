import { injectable } from "inversify";
import { EntityRepository, Repository } from "typeorm";

import { IBaseRepository } from "@/lib/repository/base_repository";
import { RefreshToken } from "@/entity/oauth/refresh_token_entity";

export interface IRefreshTokenRepository extends IBaseRepository<RefreshToken> {
}

@injectable()
@EntityRepository(RefreshToken)
export class RefreshTokenRepository extends Repository<RefreshToken> implements IRefreshTokenRepository {
  findById(uuid: string) {
    return this.findOneOrFail(uuid);
  }
}
