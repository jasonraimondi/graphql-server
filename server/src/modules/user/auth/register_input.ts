import { Field, InputType } from "type-graphql";
import { IsEmail, Length } from "class-validator";

import { ValidateAgainstDuplicateEmail } from "@/modules/validator/validate_against_existing_email";

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
    @ValidateAgainstDuplicateEmail({ message: "email already exists" })
    email: string;

    @Field()
    @Length(5, 255)
    password: string;
}
