import { User } from "@/entity/user_entity";
import { Field, ObjectType } from "type-graphql";
import { EmailConfirmation } from "@/entity/email_confirmation_entity";

@ObjectType()
export class RegisterResponse {
    @Field(() => User, { nullable: true })
    user?: User;
    @Field(() => EmailConfirmation, { nullable: true })
    userConfirmation?: EmailConfirmation;
}
