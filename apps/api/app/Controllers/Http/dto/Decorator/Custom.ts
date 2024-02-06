import { registerDecorator, ValidatorConstraint, ValidationArguments } from 'class-validator'

type Options = {
  each?: boolean
  message: string
  function: (value: any, args: ValidationArguments) => boolean
}

@ValidatorConstraint()
export class CustomConstraint {
  public validate (_: any, args: ValidationArguments) {
    return args.constraints[1].function(_, args)
  }
}

export function Custom (properties: string | symbol | (string | symbol)[], options: Options) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'related',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties, options],
      options: {
        message: () => {
          return options?.message as string
        },
        each: options?.each,
      },
      validator: CustomConstraint,
    })
  }
}
