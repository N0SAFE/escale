import { ClassTransformOptions, Exclude, instanceToInstance } from 'class-transformer'
import { validate, getMetadataStorage } from 'class-validator'
import { customMetadataConsumerSymbol } from './index'

export const afterSymbol = Symbol('after')

// import isPlainObject from 'putil-isplainobject'

export class BaseDto {
  @Exclude()
  public skipTransform: {
    key: string
    type: new (...args: any[]) => any | undefined
  }[]
  public customTransform: Promise<this>
  constructor (args, disableCustomTransform = false) {
    // to do add a generic type that is the this
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

    this.skipTransform = Reflect.getMetadata('skipTransform', this.constructor) || []
    const skipTransformPorperties = this.skipTransform.map(function ({key}){
      return args[key]
    })

    Object.entries(args).forEach(([key, value]) => {
      if (this.skipTransform.some((skip) => skip.key === key)){
        return
      }
      this[key] = value
    })

    const transform = this.transform()
    BaseDto.resetProperties(skipTransformPorperties, this.skipTransform, transform)
    if (disableCustomTransform){
      transform.customTransform = Promise.resolve(transform)
      return transform
    }
    const duplicate = this.duplicate()
    transform.customTransform = this.handleCustomTransform(duplicate).then(async (duplicate) => {
      // Exclude()(duplicate.constructor)
      BaseDto.resetProperties(skipTransformPorperties, this.skipTransform, duplicate)
      return duplicate
    })
    transform.skipTransform = this.skipTransform
    return transform
  }

  public static removeProperties<T> (
    props: {
      key: any
      type: new (...args: any[]) => any | undefined
    }[],
    target: T,
    callback?: (target: T, key: string | Symbol | number, value: any) => void
  ) {
    delete target['skipTransform']
    props.forEach((prop) => {
      callback && callback(target, prop.key, target[prop.key])
      delete target[prop.key]
    })
  }

  public static resetProperties<T> (
    values: any[],
    props: {
      key: any
      type: new (...args: any[]) => any | undefined
    }[],
    target: T,
    callback?: (target: T, keys: any, value: any) => void
  ) {
    target['skipTransform'] = props
    props.forEach((prop, index) => {
      callback && callback(target, prop.key, values[index])
      if (prop.type && typeof values[index] === 'object') {
        target[prop.key] = Object.assign(new prop.type(), values[index])
        return
      }
      target[prop.key] = values[index]
    })
  }

  public async validate () {
    const newInstance = this.transform()
    return await validate(newInstance, { whitelist: true, forbidUnknownValues: false })
  }

  public transform (options?: ClassTransformOptions) {
    const skipTransform = this.skipTransform
    const skipedProperties: any[] = []
    BaseDto.removeProperties(skipTransform, this, (_, __, value) => skipedProperties.push(value))
    const newInstance = instanceToInstance(this, options)
    BaseDto.resetProperties(skipedProperties, skipTransform, this)
    BaseDto.resetProperties(skipedProperties, skipTransform, newInstance)
    return newInstance
  }

  public duplicate () {
    const skipTransform = this.skipTransform
    const skipedProperties: any[] = []
    BaseDto.removeProperties(skipTransform, this, (_, __, value) => skipedProperties.push(value))
    const newInstance = instanceToInstance(this)
    BaseDto.resetProperties(skipedProperties, skipTransform, this)
    BaseDto.resetProperties(skipedProperties, skipTransform, newInstance)
    return newInstance
  }

  public async handleCustomTransform (duplicate): Promise<this> {
    const classValidatorMetadataStorage = getMetadataStorage()
    const rec = (target): Promise<any> => {
      if (!target) {
        return Promise.resolve()
      }
      if (target[customMetadataConsumerSymbol]) {
        const ret = target[customMetadataConsumerSymbol]()
        return ret
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
