import { ExternalCalendar } from './ExternalCalendar'
import { Image } from './Image'
import { Entity, TypeSwitch, IdedSymbol } from './utils'

enum Relations {
    externalCalendar = 'ExternalCalendarEvents:ExternalCalendar',
}

type RelationCases = [
    {
        key: 'externalCalendar'
        value: ExternalCalendar
    },
]

type RelationKeyCases = [[Relations.externalCalendar, 'externalCalendar']]
type RelationValueCases<R extends string[] = []> = [
    [
        Relations.externalCalendar,
        ExternalCalendar<Exclude<R, Relations.externalCalendar>>,
    ],
]

export type ExternalCalendarEvents<R extends string[] = []> = Entity<
    {
        id: number
        from: 'airbnb' | 'booking'
        type: 'blocked' | 'reserved'
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

export default Relations
