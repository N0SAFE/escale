type Promisable<T> = T | Promise<T>

type Handler = <T extends {}, K extends keyof T, V extends T[K] = T[K]>(
  target: T,
  key: K,
  value: V
) => Promisable<T[K]>

export const customMetadataHandlerSymbol = Symbol('customMetadata')
export const customMetadataConsumerSymbol = Symbol('customMetadataConsumer')

type Metadatas<T> = Map<keyof T, Handler[]> & {
  [customMetadataConsumerSymbol]: () => Promise<void>
}

export function defineMetadata<T extends {}, K extends keyof T>(
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
