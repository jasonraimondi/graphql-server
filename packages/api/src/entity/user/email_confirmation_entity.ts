import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";

import { User } from "./user_entity";
import { BaseEntity } from "../entity";
import { addDays } from "@/entity/oauth/authorization_code_entity";

@ObjectType()
@Entity()
export class EmailConfirmation extends BaseEntity {

  constructor(user?: User, id?: string) {
    super(id);
    if (user) this.user = user;
    this.expiresAt = addDays(new Date(), 7);
  }

  @Field(() => ID)
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field()
  @Column()
  expiresAt: Date;
}
