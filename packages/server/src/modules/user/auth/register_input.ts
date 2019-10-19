import { Field, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";

@InputType()
export class RegisterInput {
    @Field({ nullable: true })
    uuid?: string;

    @Field({ nullable: true })
    firstName?: string;

    @Field({ nullable: true })
    lastName?: string;

    @Field()
    @IsEmail()
    email: string;

    @Field()
    @Length(5)
    password: string;
}
