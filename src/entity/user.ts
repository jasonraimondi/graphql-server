import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType, Root } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn("uuid")
    uuid: string;

    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    @Field()
    name(@Root() parent: User): string {
        return `${parent.firstName} ${parent.lastName}`;
    }

    @Field()
    @Column("text", { unique: true })
    email: string;

    @Column()
    password: string;

    @Column("int", { default: 0 })
    tokenVersion: number;
}
