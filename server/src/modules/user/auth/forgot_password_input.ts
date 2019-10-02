import { Field, InputType } from "type-graphql";
import { IsEmail } from "class-validator";

@InputType()
export class ForgotPasswordInput {
    @Field()
    @IsEmail()
    email: string;
}
