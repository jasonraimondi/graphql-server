import { Field, InputType } from "type-graphql";
import { IsEmail, IsUUID } from "class-validator";

@InputType()
export class VerifyEmailInput {
    @Field()
    @IsEmail()
    email: string;

    @Field()
    @IsUUID("4")
    uuid: string;
}
