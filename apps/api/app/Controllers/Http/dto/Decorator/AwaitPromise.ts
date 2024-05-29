import { defineMetadata } from '../index'

export function AwaitPromise<T extends {}, K extends keyof T>(target: T, propertyKey: K) {
  defineMetadata(target, propertyKey, async (target, propertyKey) => {
    const value = target[propertyKey]
    return await value
  })
}
