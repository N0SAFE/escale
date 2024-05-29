import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator'
import { DateTime } from 'luxon'

@ValidatorConstraint()
export class IsAfterNowConstraint implements ValidatorConstraintInterface {
  public validate(date: DateTime) {
    return date >= DateTime.now()
  }

  public defaultMessage(args: ValidationArguments) {
    return `Date ${args.property} can not before now.`
  }
}

export function IsAfterNow(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsAfterNowConstraint,
    })
  }
}
