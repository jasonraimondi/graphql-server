import { CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType, Root } from "type-graphql";
import v4 from "uuid/v4";

import { User } from "@/entity/user_entity";

@ObjectType()
@Entity()
export class EmailConfirmation {
    constructor(uuid?: string) {
        if (!uuid) uuid = v4();
        this.uuid = uuid;
    }

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
    expiresAt(@Root() parent: EmailConfirmation): Date {
        const created = new Date(parent.createdAt);
        // valid for 7 days
        const validFor = 60 * 60 * 24 * 7;
        return new Date(created.getTime() + (validFor * 1000));
    }
}
