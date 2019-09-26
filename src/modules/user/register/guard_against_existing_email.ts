import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from "class-validator";

import { User } from "@entity/user";

export function GuardAgainstExistingEmail(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: GuardAgainstExistingEmailConstraint,
        });
    };
}

@ValidatorConstraint({ async: true })
class GuardAgainstExistingEmailConstraint implements ValidatorConstraintInterface {
    validate(email: string) {
        return User.findOne({ where: { email } }).then(user => {
            return !user;
        });
    }
}
