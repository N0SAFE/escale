import {
  registerDecorator,
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

type Size = `${number}b` | `${number}kb` | `${number}mb` | `${number}gb`

type Property = {
  extnames?: string[]
  mimeTypes?: string[]
  maxSize?: number | Size
}

@ValidatorConstraint()
export class ValidateFileConstraint implements ValidatorConstraintInterface {
  private getSize(size: number | Size) {
    if (typeof size === 'number') {
      return size
    }
    const [unit, value] = (() => {
      const [unit, value] = size.match(/(\d+)(\w+)/) as [string, string]
      return [unit.replace(/\d+/g, ''), value]
    })()
    switch (unit) {
      case 'b':
        return parseInt(value)
      case 'kb':
        return parseInt(value) * 1024
      case 'mb':
        return parseInt(value) * 1024 * 1024
      case 'gb':
        return parseInt(value) * 1024 * 1024 * 1024
      default:
        throw new Error('invalid size')
    }
  }
  public async validate(file: MultipartFileContract, args: ValidationArguments) {
    const [property] = args.constraints as [Property]
    if (property.extnames && (!file.extname || !property.extnames.includes(file.extname))) {
      return false
    }
    if (property.mimeTypes && (!file.type || !property.mimeTypes.includes(file.type))) {
      return false
    }
    if (property.maxSize && file.size > this.getSize(property.maxSize)) {
      return false
    }
    return true
  }
}

export function ValidateFile(property: Property, options?: { each?: boolean }) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: () => {
          if (options?.each) {
            return `one of the file for ${propertyName} is invalid`
          } else {
            return `the file for ${propertyName} is invalid`
          }
        },
        each: options?.each ?? false,
      },
      validator: ValidateFileConstraint,
    })
  }
}
