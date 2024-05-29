import { registerDecorator, ValidatorConstraint, ValidationArguments } from 'class-validator'
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'

type CustomOptions = {
  each?: boolean
  nullable?: boolean
}

type CustomOptionsConstraint = {
  nullable: boolean
}

@ValidatorConstraint({ async: true })
export class EntityExistConstraint {
  public async validate(value: number, args: ValidationArguments) {
    const [relatedModel, options] = args.constraints as [typeof BaseModel, CustomOptionsConstraint]
    if (options.nullable && value === null) {
      return true
    }
    if (!value) {
      return false
    }
    const relatedModelInstance = await relatedModel.find(value)
    return relatedModelInstance !== null
  }
}

export function EntityExist(model: typeof BaseModel, options?: CustomOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'entityExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [model, { nullable: options?.nullable ?? false }],
      options: {
        message: (validationArguments) => {
          if (!Array.isArray(validationArguments.value)) {
            return `the instance of ${model.name} with id ${validationArguments.value} does not exist`
          }
          return `one of the instance of ${model.name} with ids [${validationArguments.value.join(
            ', '
          )}] does not exist`
        },
        each: options?.each ?? false,
      },
      validator: EntityExistConstraint,
    })
  }
}
