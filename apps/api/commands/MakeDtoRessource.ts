import { BaseCommand, args, flags } from '@adonisjs/core/build/standalone'
import fs from 'fs'
import { resolve } from 'path'

export default class MakeDtoRessource extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'make:dto:ressource'

  @flags.boolean({ alias: 'F', description: 'force to rewrite the file' })
  public force: boolean

  @flags.boolean({ alias: 'R', description: 'Reset all the dto files' })
  public reset: boolean

  @args.string({ description: 'Name of the ressource' })
  public name: string

  @flags.string({ alias: 'L', description: 'Location of the Dto' })
  public location: string = this.application.resolveNamespaceDirectory('httpControllers')!

  @flags.boolean({
    alias: 'M',
    description: 'Make the dto for all http method',
  })
  public useHttpMethod: boolean

  @flags.boolean({
    alias: 'C',
    description: 'Make the dto for all method of a given controller',
  })
  public useController: boolean

  @flags.string({
    alias: 'c',
    description: 'Name of the controller to use',
  })
  public controllerToUse: string

  @flags.array({
    alias: 'N',
    description: 'Name of the dto files to create',
  })
  public dtoToCreate: string[]

  /**
   * Command description is displayed in the "help" output
   */
  public static description = 'Make dto file for a controller ressource with all methods'

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: false,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public httpMethodList: string[] = ['Delete', 'Get', 'GetCollection', 'Patch', 'Post', 'Put']

  public fileTemplate (method) {
    const tempName = this.name.replace(/Controller$/, '').replace(/Dto$/, '')
    const name = tempName.charAt(0).toUpperCase() + tempName.slice(1)
    return fileTemplate(name, method)
  }

  public indexTemplate () {
    return indexTemplate()
  }

  public baseDtoTemplate () {
    return baseDtoTemplate()
  }

  public awaitPromiseDecoratorTemplate () {
    return awaitPromiseDecoratorTemplate()
  }

  public entityExistDecoratorTemplate () {
    return entityExistDecoratorTemplate()
  }

  public propertyExistDecoratorTemplate () {
    return propertyExistDecoratorTemplate()
  }

  public validateFileDecoratorTemplate () {
    return validateFileDecoratorTemplate()
  }

  public AsSamePropertiesTypeTemplate () {
    return AsSamePropertiesTypeTemplate()
  }

  public async run () {
    const appRoot = this.application.appRoot
    const dtoDir = resolve(appRoot, this.location, 'dto')
    const relativeDtoDir = resolve(this.location!, 'dto')

    const fileToCreate: string[] = []

    if (this.useController) {
      if (this.controllerToUse) {
        const controllerName = this.controllerToUse.replace(/Controller$/, '')
        try {
          const controller = await import(
            resolve(appRoot, this.location, controllerName + 'Controller')
          )
          if (controller.default) {
            const controllerInstance = new controller.default()
            const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(controllerInstance))
              .filter((method) => method !== 'constructor')
              .map((method) => method.charAt(0).toUpperCase() + method.slice(1))

            methods.forEach((method) => {
              fileToCreate.push(method)
            })
          } else {
            this.logger
              .action('create file')
              .failed(resolve(this.location, controllerName + 'Controller'), 'no default export')
            return false
          }
        } catch (e) {
          this.logger
            .action('create file')
            .failed(
              resolve(this.location, controllerName + 'Controller'),
              'the controller ' +
                this.controllerToUse.replace(/Controller$/, '') +
                'Controller ' +
                ' does not exist'
            )
          return false
        }
      } else {
        this.logger.action('create file').failed('no controller name given', 'missing argument')
        return false
      }
    }

    if (this.useHttpMethod) {
      this.httpMethodList.forEach((method) => {
        fileToCreate.push(method)
      })
    }

    if (Array.isArray(this.dtoToCreate) && this.dtoToCreate.length > 0) {
      this.dtoToCreate.forEach((dto) => {
        fileToCreate.push(dto)
      })
    }

    if (!fs.existsSync(dtoDir)) {
      fs.mkdirSync(dtoDir)
      this.logger.action('create dir').succeeded(relativeDtoDir)
    }

    if (!fs.existsSync(resolve(dtoDir, 'index.ts'))) {
      fs.writeFileSync(resolve(dtoDir, 'index.ts'), this.indexTemplate())
      this.logger.action('create file').succeeded(resolve(relativeDtoDir, 'index.ts'))
    } else {
      this.logger
        .action('create file')
        .skipped(resolve(relativeDtoDir, 'index.ts'), 'already exist')
    }

    if (!fs.existsSync(resolve(dtoDir, 'BaseDto.ts'))) {
      fs.writeFileSync(resolve(dtoDir, 'BaseDto.ts'), this.baseDtoTemplate())
      this.logger.action('create file').succeeded(resolve(relativeDtoDir, 'BaseDto.ts'))
    } else {
      this.logger
        .action('create file')
        .skipped(resolve(relativeDtoDir, 'BaseDto.ts'), 'already exist')
    }

    if (!fs.existsSync(resolve(dtoDir, 'Decorator'))) {
      fs.mkdirSync(resolve(dtoDir, 'Decorator'))
      this.logger.action('create dir').succeeded(resolve(relativeDtoDir, 'Decorator'))
    } else {
      this.logger
        .action('create dir')
        .skipped(resolve(relativeDtoDir, 'Decorator'), 'already exist')
    }

    if (!fs.existsSync(resolve(dtoDir, 'Decorator', 'AwaitPromise.ts'))) {
      fs.writeFileSync(
        resolve(dtoDir, 'Decorator', 'AwaitPromise.ts'),
        this.awaitPromiseDecoratorTemplate()
      )
      this.logger
        .action('create file')
        .succeeded(resolve(relativeDtoDir, 'Decorator', 'AwaitPromise.ts'))
    } else {
      this.logger
        .action('create file')
        .skipped(resolve(relativeDtoDir, 'Decorator', 'AwaitPromise.ts'), 'already exist')
    }

    if (!fs.existsSync(resolve(dtoDir, 'Decorator', 'EntityExist.ts'))) {
      fs.writeFileSync(
        resolve(dtoDir, 'Decorator', 'EntityExist.ts'),
        this.entityExistDecoratorTemplate()
      )
      this.logger
        .action('create file')
        .succeeded(resolve(relativeDtoDir, 'Decorator', 'EntityExist.ts'))
    } else {
      this.logger
        .action('create file')
        .skipped(resolve(relativeDtoDir, 'Decorator', 'EntityExist.ts'), 'already exist')
    }

    if (!fs.existsSync(resolve(dtoDir, 'Decorator', 'PropertyExist.ts'))) {
      fs.writeFileSync(
        resolve(dtoDir, 'Decorator', 'PropertyExist.ts'),
        this.propertyExistDecoratorTemplate()
      )
      this.logger
        .action('create file')
        .succeeded(resolve(relativeDtoDir, 'Decorator', 'PropertyExist.ts'))
    } else {
      this.logger
        .action('create file')
        .skipped(resolve(relativeDtoDir, 'Decorator', 'PropertyExist.ts'), 'already exist')
    }

    if (!fs.existsSync(resolve(dtoDir, 'Decorator', 'ValidateFile.ts'))) {
      fs.writeFileSync(
        resolve(dtoDir, 'Decorator', 'ValidateFile.ts'),
        this.validateFileDecoratorTemplate()
      )
      this.logger
        .action('create file')
        .succeeded(resolve(relativeDtoDir, 'Decorator', 'ValidateFile.ts'))
    } else {
      this.logger
        .action('create file')
        .skipped(resolve(relativeDtoDir, 'Decorator', 'ValidateFile.ts'), 'already exist')
    }

    if (!fs.existsSync(resolve(dtoDir, 'type'))) {
      fs.mkdirSync(resolve(dtoDir, 'type'))
      this.logger.action('create dir').succeeded(resolve(relativeDtoDir, 'type'))
    } else {
      this.logger.action('create dir').skipped(resolve(relativeDtoDir, 'type'), 'already exist')
    }

    if (!fs.existsSync(resolve(dtoDir, 'type', 'AsSameProperties.ts'))) {
      fs.writeFileSync(
        resolve(dtoDir, 'type', 'AsSameProperties.ts'),
        this.AsSamePropertiesTypeTemplate()
      )
      this.logger
        .action('create file')
        .succeeded(resolve(relativeDtoDir, 'type', 'AsSameProperties.ts'))
    } else {
      this.logger
        .action('create file')
        .skipped(resolve(relativeDtoDir, 'type', 'AsSameProperties.ts'), 'already exist')
    }

    const tempDtoDirName = this.name.replace(/Controller$/, '').replace(/Dto$/, '') + 'Dto'
    const dtoDirName = tempDtoDirName.charAt(0).toUpperCase() + tempDtoDirName.slice(1)
    if (!fs.existsSync(resolve(dtoDir, dtoDirName))) {
      if (this.reset) {
        fs.rmdirSync(resolve(dtoDir, dtoDirName), { recursive: true })
      }
      fs.mkdirSync(resolve(dtoDir, dtoDirName))
      this.logger.action('create dir').succeeded(resolve(relativeDtoDir, dtoDirName))
    } else {
      this.logger.action('create dir').skipped(resolve(relativeDtoDir, dtoDirName), 'already exist')
    }

    if (!this.force) {
      const exit = fileToCreate.some((file) => {
        file = file.charAt(0).toUpperCase() + file.slice(1)
        if (fs.existsSync(resolve(dtoDir, dtoDirName, file + '.ts'))) {
          this.logger
            .action('create file')
            .failed(resolve(relativeDtoDir, dtoDirName, file + '.ts'), 'already exist')
          return true
        }
        return false
      })
      if (exit) {
        return false
      }
    }

    fileToCreate.forEach((file) => {
      file = file.charAt(0).toUpperCase() + file.slice(1)
      fs.writeFileSync(resolve(dtoDir, dtoDirName, file + '.ts'), this.fileTemplate(file))
      this.logger.action('create file').succeeded(resolve(relativeDtoDir, dtoDirName, file + '.ts'))
    })
  }
}

export function awaitPromiseDecoratorTemplate () {
  return `import { defineMetadata } from '../index'

export function AwaitPromise<T extends {}, K extends keyof T> (target: T, propertyKey: K) {
  defineMetadata(target, propertyKey, async (target, propertyKey) => {
    const value = target[propertyKey]
    return await value
  })
}
`
}

export function entityExistDecoratorTemplate () {
  return `import { registerDecorator, ValidatorConstraint, ValidationArguments } from 'class-validator'
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'

@ValidatorConstraint({ async: true })
export class EntityExistConstraint {
  public async validate(value: number | number[], args: ValidationArguments) {
    const [relatedModel] = args.constraints
    if (!Array.isArray(value)) {
      value = [value]
    }
    const relatedModelInstance = await relatedModel.findMany(value)
    return relatedModelInstance.length === value.length
  }
}

export function EntityExist(model: typeof BaseModel) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'entityExist',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [model],
      options: {
        message: (validationArguments) => {
          if (!Array.isArray(validationArguments.value)) {
            return \`the instance of \${model.name} with id \${validationArguments.value} does not exist\`
          }
          return \`one of the instance of \${model.name} with ids [\${validationArguments.value.join(
            ', '
          )}] does not exist\`
        },
      },
      validator: EntityExistConstraint,
    })
  }
}
`
}

export function propertyExistDecoratorTemplate () {
  return `import { registerDecorator, ValidatorConstraint, ValidationArguments } from 'class-validator'

@ValidatorConstraint()
export class PropertyExistConstraint {
  public validate (_: any, args: ValidationArguments) {
    const [relatedProperty] = args.constraints
    const self = args.object
    if (Array.isArray(relatedProperty)) {
      return relatedProperty.every((property) => !!self[property])
    } else {
      return !!self[relatedProperty]
    }
  }
}

export function PropertyExist (properties: string | symbol | (string | symbol)[]) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'related',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties],
      options: {
        message: (validationArguments) => {
          return \`the property \${
            validationArguments.property
          } can't be set without the properties \${validationArguments.constraints.join(', ')}\`
        },
      },
      validator: PropertyExistConstraint,
    })
  }
}
`
}

export function validateFileDecoratorTemplate () {
  return `import {
  registerDecorator,
  ValidatorConstraint,
  ValidationArguments,
  ValidatorConstraintInterface,
} from 'class-validator'
import { MultipartFileContract } from '@ioc:Adonis/Core/BodyParser'

type Size = \`\${number}b\` | \`\${number}kb\` | \`\${number}mb\` | \`\${number}gb\`

type Property = {
  extnames?: string[]
  mimeTypes?: string[]
  maxSize?: number | Size
}

@ValidatorConstraint()
export class ValidateFileConstraint implements ValidatorConstraintInterface {
  private getSize (size: number | Size) {
    if (typeof size === 'number') {
      return size
    }
    const [value, unit] = size.match(/(\d+)(\w+)/) as [string, string]
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
  public async validate (file: MultipartFileContract, args: ValidationArguments) {
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

export function ValidateFile (property: Property, options?: { each?: boolean }) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'validateFile',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: {
        message: () => {
          if (options?.each) {
            return \`one of the file for \${propertyName} is invalid\`
          } else {
            return \`the file for \${propertyName} is invalid\`
          }
        },
        each: options?.each ?? false,
      },
      validator: ValidateFileConstraint,
    })
  }
}
`
}

export function AsSamePropertiesTypeTemplate () {
  return `export type AsSameProperties<T> = {
  [key in keyof T]: any
}
`
}

export function indexTemplate () {
  return `type Promisable<T> = T | Promise<T>

type Handler = <T extends {}, K extends keyof T, V extends T[K] = T[K]>(
  target: T,
  key: K,
  value: V
) => Promisable<T[K]>

type Metadatas<T> = Map<keyof T, Handler[]> & {
  [customMetadataConsumerSymbol]: () => Promise<void>
}

export const customMetadataHandlerSymbol = Symbol('customMetadata')
export const customMetadataConsumerSymbol = Symbol('customMetadataConsumer')

export function defineMetadata<T extends {}, K extends keyof T> (
  target: T,
  key: K,
  handler: Handler
) {
  if (!target[customMetadataHandlerSymbol]) {
    Object.defineProperty(target, customMetadataHandlerSymbol, {
      value: new Map(),
      enumerable: false,
      configurable: true,
    })

    Object.defineProperty(target, customMetadataConsumerSymbol, {
      value: async function () {
        return Promise.all(
          Array.from((this[customMetadataHandlerSymbol] as Metadatas<T>).entries()).map(
            async ([key, handlers]) => {
              const value = this[key]
              for (const handler of handlers) {
                this[key] = await handler(this, key, value)
              }
            }
          )
        )
      },
    })
  }

  const metadatas: Metadatas<T> = target[customMetadataHandlerSymbol]

  if (!metadatas.has(key)) {
    metadatas.set(key, [])
  }

  metadatas.get(key)!.push(handler)
}
`
}

export function baseDtoTemplate () {
  return `import { ClassTransformOptions, instanceToInstance } from 'class-transformer'
import { validate } from 'class-validator'

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

    const duplicate = instanceToInstance(this, { ignoreDecorators: true, excludePrefixes: ['_', '__'] })
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
      if (!target) {
        return Promise.resolve()
      }
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
`
}

export function fileTemplate (name, method) {
  return `import {
  IsDefined,
  IsObject,
  ValidateNested,
} from 'class-validator'
import { RequestBaseDto } from '../RequestBaseDto'
import { Type } from 'class-transformer'
import { AsSameProperties } from '../type/AsSameProperties'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export class ${name}Ressource${method}BodyDto {}

export class ${name}Ressource${method}QueryDto {}

export class ${name}Ressource${method}FilesDto {}

export class ${name}Ressource${method}Dto extends RequestBaseDto {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ${name}Ressource${method}BodyDto)
  public body: ${name}Ressource${method}BodyDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ${name}Ressource${method}QueryDto)
  public query: ${name}Ressource${method}QueryDto

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ${name}Ressource${method}FilesDto)
  public _images: ${name}Ressource${method}FilesDto

  public get after () {
    return new ${name}Ressource${method}DtoAfter(this)
  }

  public static fromRequest (request: RequestContract) {
    return new this({ body: request.body(), query: request.qs(), _images: request.allFiles() })
  }
}

export class ${name}Ressource${method}BodyDtoAfter implements AsSameProperties<${name}Ressource${method}BodyDto> {}

export class ${name}Ressource${method}QueryDtoAfter implements AsSameProperties<${name}Ressource${method}QueryDto> {}

export class ${name}Ressource${method}FilesDtoAfter implements AsSameProperties<${name}Ressource${method}FilesDto> {}

export class ${name}Ressource${method}DtoAfter extends RequestBaseDto implements AsSameProperties<Omit<${name}Ressource${method}Dto, 'after'>> {
  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ${name}Ressource${method}BodyDtoAfter)
  public body: ${name}Ressource${method}BodyDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ${name}Ressource${method}QueryDtoAfter)
  public query: ${name}Ressource${method}QueryDtoAfter

  @IsDefined()
  @IsObject()
  @ValidateNested()
  @Type(() => ${name}Ressource${method}FilesDtoAfter)
  public _images: ${name}Ressource${method}FilesDtoAfter
}
`
}
