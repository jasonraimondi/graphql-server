import { DeepPartial, DeleteResult, Repository } from "typeorm";

export abstract class BaseRepository<T> {
    protected constructor(protected readonly repository: Repository<T>) {
    }

    findById(uuid: string): Promise<T> {
        return this.repository.findOneOrFail({ where: { uuid } });
    }

    find(): Promise<T[]> {
        return this.repository.find();
    }

    create(entity: DeepPartial<T>): T {
        return this.repository.create(entity);
    }

    delete(uuid: string): Promise<DeleteResult> {
        return this.repository.delete(uuid);
    }

    async save(entity: T): Promise<void> {
        await this.repository.save(entity);
    }
}