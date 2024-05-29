import { BaseDto } from '../BaseDto'

export function SkipTransform(properties: (string | [string, new (...args: any[]) => any])[]) {
  return function <T extends typeof BaseDto>(Class: T) {
    const props = properties.map((property) => {
      if (Array.isArray(property)) {
        return {
          key: property[0],
          type: property[1],
        }
      }
      return {
        key: property,
        type: undefined,
      }
    })
    Reflect.defineMetadata('skipTransform', props, Class)

    return Class
  }
}
