import { injectable } from "inversify";
import { EntityRepository, Repository } from "typeorm";

import { User } from "@/entity/user/user_entity";
import { Itinerary } from "@/entity/itinerary/itinerary_entity";

interface IItineraryRepository {
    findById(uuid: string): any;
}

@injectable()
@EntityRepository(Itinerary)
export class ItineraryRepository extends Repository<User> implements IItineraryRepository {
    findById(uuid: string) {
        return this.findOneOrFail(uuid);
    }
}