import { registerDecorator, ValidatorConstraint, ValidationArguments } from 'class-validator'

@ValidatorConstraint()
export class PropertyExistConstraint {
  public validate (_: any, args: ValidationArguments) {
    const [relatedProperty] = args.constraints
    const self = args.object
    return !!self[relatedProperty]
  }
}

export function PropertyExist (
  properties: string | symbol | (string | symbol)[],
  options?: { each: boolean }
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'related',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties],
      options: {
        message: (validationArguments) => {
          return `the property ${
            validationArguments.property
          } can't be set without the properties ${validationArguments.constraints.join(', ')}`
        },
        each: options?.each,
      },
      validator: PropertyExistConstraint,
    })
  }
}
