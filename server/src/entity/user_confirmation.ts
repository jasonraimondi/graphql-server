import { BaseEntity, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType, Root } from "type-graphql";

import { User } from "@entity/user";

@ObjectType()
@Entity()
export class UserConfirmation extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn("uuid")
    uuid: string;

    @Field(() => User)
    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    expiresAt(@Root() parent: UserConfirmation): Date {
        const created = new Date(parent.createdAt);
        // valid for 7 days
        const validFor = 60 * 60 * 24 * 7;
        return new Date(created.getTime() + (validFor * 1000));
    }
}
