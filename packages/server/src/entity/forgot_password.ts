import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType, Root } from "type-graphql";
import v4 from "uuid/v4";

import { User } from "@/entity/user";

@ObjectType()
@Entity()
export class ForgotPassword {
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
    @Column()
    createdAt: Date;

    @Field()
    expiresAt(@Root() parent: ForgotPassword): Date {
        const created = new Date(parent.createdAt);
        // valid for 1 days
        const validFor = 60 * 60 * 24;
        return new Date(created.getTime() + (validFor * 1000));
    }
}
