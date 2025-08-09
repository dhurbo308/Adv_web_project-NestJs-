import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

@ValidatorConstraint({ name: "SellerName", async: false })
export class SellerNameConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments): boolean {
    return /^[A-Za-z\s]+$/.test(value); // Only letters and spaces
  }

  defaultMessage(args: ValidationArguments) {
    return "Name must contain only alphabets and spaces";
  }
}

export function SellerName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: SellerNameConstraint,
    });
  };
}
