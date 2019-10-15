import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType, Root } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field(() => ID)
    @PrimaryColumn("uuid")
    uuid: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    lastName?: string;

    @Field()
    @Column("text", { unique: true })
    email: string;

    @Column()
    password: string;

    @Field()
    @Column("boolean", { default: false })
    isVerified: boolean;

    @Column("int", { default: 0 })
    tokenVersion: number;

    @Field(() => String!, { nullable: true })
    name(@Root() {firstName, lastName}: User): string|null {
        const name = [];
        if (firstName) name.push(firstName);
        if (lastName) name.push(lastName);
        return name.join(" ") || null;
    }
}
