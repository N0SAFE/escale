import { Spa } from './Spa'
import { Entity, TypeSwitch, IdedSymbol } from './utils'

enum Relations {
    spa = 'unavailability:spa',
}

type RelationCases = [
    {
        key: 'spa'
        value: Spa
    },
]

type RelationKeyCases = [[Relations.spa, 'spa']]
type RelationValueCases<R extends string[] = []> = [
    [Relations.spa, Spa<Exclude<R, Relations.spa>>],
]

export type Unavailability<R extends string[] = []> = Entity<
    {
        id: number
        startAt: string
        endAt: string
    } & {
        [K in R[number] as TypeSwitch<K, RelationKeyCases>]: TypeSwitch<
            K,
            RelationValueCases<R>
        >
    } & {
        [O in RelationCases[number] as O['value'] extends {
            [IdedSymbol]: true
        }
            ? `${O['key']}Id`
            : never]: number
    }
>

export type CreateUnavailability = Omit<Unavailability, 'id'>

export type UpdateUnavailability = Partial<Omit<Unavailability, 'id'>>

export default Relations
