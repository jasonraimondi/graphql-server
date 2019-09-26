import { Field, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";

import { GuardAgainstExistingEmail } from "@modules/user/register/guard_against_existing_email";

@InputType()
export class RegisterInput {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field()
    @IsEmail()
    @GuardAgainstExistingEmail({ message: "email already exists" })
    email: string;

    @Field()
    @Length(5, 255)
    password: string;
}
