import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import v4 from "uuid/v4";

import { User } from "@/entity/user_entity";

@ObjectType()
@Entity()
export class ForgotPassword {
    constructor(uuid?: string, user?: User) {
        if (!uuid) uuid = v4();
        this.uuid = uuid;
        if (user) this.user = user;
        const validFor = 60 * 60 * 24 * 1; // 7 days
        this.expiresAt = new Date(Date.now() + (validFor * 1000));
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
    expiresAt: Date;
}
