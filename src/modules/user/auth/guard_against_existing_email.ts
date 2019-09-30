import {
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from "class-validator";

import { User } from "@entity/user";

export function GuardAgainstDuplicateEmail(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: GuardAgainstDuplicateEmailConstraint,
        });
    };
}

@ValidatorConstraint({ async: true })
class GuardAgainstDuplicateEmailConstraint implements ValidatorConstraintInterface {
    validate(email: string) {
        return User.findOne({ where: { email } }).then(user => {
            return !user;
        });
    }
}
