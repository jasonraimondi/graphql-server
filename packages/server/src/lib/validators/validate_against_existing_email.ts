import {
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    registerDecorator,
} from "class-validator";

// import { UserRepository } from "@/lib/repository/user/user_repository";

export function ValidateAgainstDuplicateEmail(validationOptions?: ValidationOptions) {
    return (object: Object, propertyName: string) => {
        console.log(object, propertyName, validationOptions);
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: ValidateAgainstDuplicateEmailConstraint,
        });
    };
}

@ValidatorConstraint({ async: true })
class ValidateAgainstDuplicateEmailConstraint implements ValidatorConstraintInterface {
    validate(email: string) {
        console.log(email, this);
        return false;
        // console.log(this);
        // return this.userRepository.findOne({ where: { email } }).then(user => {
        //     return !user;
        // });
    }
}
