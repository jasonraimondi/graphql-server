import { Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType, Root } from "type-graphql";
import v4 from "uuid/v4";

import { Role } from "@/entity/role_entity";
import { Permission } from "@/entity/permission_entity";
import { compare, hash } from "bcryptjs";

export interface ICreateUser {
    email: string;
    uuid?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
}

@ObjectType()
@Entity()
export class User {
    static async create({ uuid, email, firstName, lastName, password }: ICreateUser) {
        const user = new User(uuid);
        user.email = email.toLowerCase();
        user.firstName = firstName;
        user.lastName = lastName;
        await user.setPassword(password);
        return user;
    }

    constructor(uuid?: string) {
        if (!uuid) uuid = v4();
        this.uuid = uuid;
        this.tokenVersion = 0;
        this.isEmailConfirmed = false;
    }

    @Field(() => ID)
    @PrimaryColumn("uuid")
    uuid: string;

    @Field()
    @Column("text", { unique: true })
    email: string;

    @Column({ nullable: true })
    password?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    @Column({ nullable: true })
    lastName?: string;

    @Field()
    @Column("boolean")
    isEmailConfirmed: boolean;

    @Field(() => Date, { nullable: true })
    @Column({ nullable: true })
    lastLoginAt?: Date;

    @Column("int")
    tokenVersion: number;

    @ManyToMany(() => Role)
    @JoinTable({ name: "user_role" })
    roles: Role[];

    @ManyToMany(() => Permission)
    @JoinTable({ name: "user_permission" })
    permissions: Permission[];

    @Field()
    isActive(@Root() user: User): boolean {
        return user.isEmailConfirmed && !!user.password;
    }

    @Field(() => String!, { nullable: true })
    name(@Root() {firstName, lastName}: User): string|null {
        const name = [];
        if (firstName) name.push(firstName);
        if (lastName) name.push(lastName);
        return name.join(" ") || null;
    }

    async setPassword(password?: string) {
        this.password = undefined;
        if (password) this.password = await hash(password, 12);
    }

    async verify(password: string) {
        if (!this.password) throw new Error("user must create password");
        if (!this.isActive(this)) throw new Error("user is not active");
        if (!await compare(password, this.password)) throw new Error("invalid password");
    }
}
