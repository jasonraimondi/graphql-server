import { injectable } from "inversify";
import { Repository } from "typeorm";

import { BaseRepository } from "@/modules/repository/base_repository";
import { UserConfirmation } from "@/entity/user_confirmation";

@injectable()
export class UserConfirmationRepository extends BaseRepository<UserConfirmation> {
    constructor(repository: Repository<UserConfirmation>) {
        super(repository)
    }
}