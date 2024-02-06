import { ClassTransformOptions, instanceToInstance } from 'class-transformer'
import { validate, getMetadataStorage } from 'class-validator'
import { customMetadataConsumerSymbol } from './index'

export const afterSymbol = Symbol('after')

export class BaseDto {
  public customTransform: Promise<this>
  constructor (args) {
    /**
     * assign all args to this but only if they are defined
     * create a new instance to the nested object if the type as to be BaseDto
     */
    if (!args) {
      return
    }
    if (typeof args !== 'object') {
      throw new Error('default argument of a BaseDto instance must be an object')
    }

    Object.entries(args).forEach(([key, value]) => {
      this[key] = value
    })

    const duplicate = instanceToInstance(this, { ignoreDecorators: true })
    const transform = instanceToInstance(this)
    transform.customTransform = transform.handleCustomTransform(duplicate)
    return transform
  }

  public async validate () {
    return await validate(instanceToInstance(this), { whitelist: true, forbidUnknownValues: false })
  }

  public transform (options?: ClassTransformOptions) {
    return instanceToInstance(this, options)
  }

  public duplicate () {
    return instanceToInstance(this, { ignoreDecorators: true })
  }

  public async handleCustomTransform (duplicate): Promise<this> {
    const classValidatorMetadataStorage = getMetadataStorage()
    const rec = (target): Promise<any> => {
      if (target[customMetadataConsumerSymbol]) {
        return target[customMetadataConsumerSymbol]()
      }
      const nestedProperties = classValidatorMetadataStorage
        .getTargetValidationMetadatas(target.constructor, '', false, false)
        .filter((metadata) => metadata.type === 'nestedValidation')

      if (nestedProperties.length > 0) {
        return Promise.all(
          nestedProperties.map((metadata) => {
            const property = metadata.propertyName
            const value = target[property]
            const each = metadata.each
            if (each) {
              return Promise.all(value.map((item) => rec(item)))
            } else {
              return rec(value)
            }
          })
        )
      }

      return Promise.resolve()
    }
    await rec(duplicate)
    return duplicate
  }
}
