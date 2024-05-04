import { OmitNever, Pretify } from '../utils'

export const IdedSymbol = Symbol('Ided')
export const IdedNullableSymbol = Symbol('IdedNullable')
export type id = number

export type OptionsHas<O, K> = O extends K ? 1 : 0
// IdedEntity is a type use to define where the id for another entity is defined in an entity and if it is nullable
export type IdedEntity<
    T extends
        | {
              id: id
          }
        | {
              id: id
          }[],
    Nullable extends null | false = false
> =
    | (T & {
          [IdedSymbol]: true
          [IdedNullableSymbol]: Nullable extends null ? true : false
      })
    | (Nullable extends true ? null : never)
export type Entity<T extends {}> = Pretify<
    T &
        OmitNever<{
            [K in keyof T as Extract<K, string> extends never
                ? never
                : T[Extract<K, string>] extends
                      | {
                            [IdedSymbol]: true
                        }
                      | undefined
                      | null
                ? `${Extract<K, string>}Id`
                : never]-?: Exclude<T[K], undefined> extends
                | {
                      [IdedSymbol]: true
                  }
                | undefined
                | null
                ? Exclude<T[K], undefined> extends any[]
                    ? Exclude<T[K], undefined> extends {
                          [IdedNullableSymbol]: true
                      }
                        ? id[] | null
                        : id[]
                    : Exclude<T[K], undefined> extends {
                          [IdedNullableSymbol]: true
                      }
                    ? id | null
                    : id
                : never
        }>
>

export type UnwrapIdedEntity<T> = T extends
    | {
          [IdedSymbol]: boolean | null
      }
    | {
          [IdedNullableSymbol]: boolean | null
      }
    ? never
    : T
export type UnwrapEntity<T> = Pretify<{
    [K in keyof T as Extract<K, string> extends never
        ? never
        : T[K] extends
              | {
                    [IdedSymbol]: boolean | null
                }
              | {
                    [IdedNullableSymbol]: boolean | null
                }
        ? never
        : K]: UnwrapEntity<T[K]>
}>

export type RemoveSubEntity<T, Keep extends keyof T | null = null> = {
    [K in keyof T as T[K] extends { [IdedSymbol]: true }
        ? K extends Keep
            ? K
            : K extends string
            ? `${K}Id` extends Keep
                ? K
                : never
            : never
        : K]: T[K]
}

export type RemoveIsOfSubEntity<
    T extends Record<string, any>,
    Keep extends string | symbol | null = null,
    Deep extends boolean = false
> = {
    [K in keyof T as K extends `${infer F}Id`
        ? T[F] extends { [IdedSymbol]: true }
            ? F extends Keep
                ? K
                : K extends Keep
                ? K
                : never
            : K
        : K]: Deep extends true ? RemoveIsOfSubEntity<T[K], Keep, Deep> : T[K]
}

// TypeSwitch<toCheck, [[check, iFTrue], [check, iFTrue], [check, iFTrue] ...], default>

export type TypeSwitch<
    ToCheck,
    Cases extends [any, any][],
    Default = never
> = Cases extends [
    [infer Check, infer IfTrue],
    ...infer Rest extends [any, any][]
]
    ? ToCheck extends Check
        ? IfTrue
        : TypeSwitch<ToCheck, Rest, Default>
    : Default

// type Test = RemoveIsOfSubEntity<
//     Entity<{
//         id: number
//         image: IdedEntity<{ id: number; image: { id: number } }>
//         testId: 'terst'
//     }>,
//     'imageId'
// >

type test = TypeSwitch<
    'string',
    [['string', String], ['number', Number], ['object', Object]],
    'default'
>
