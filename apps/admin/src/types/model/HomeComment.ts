import { Comment } from './Comment'
import { Home } from './Home'
import { Entity, TypeSwitch, IdedEntity, IdedSymbol } from './utils'
import { Pretify } from '../utils'

enum Relations {
    home = 'home',
    comment = 'comment',
}

type RelationCases = [
    {
        key: 'home'
        value: IdedEntity<Home>
    },
    {
        key: 'comment'
        value: IdedEntity<Comment>
    },
]

type RelationKeyCases = [
    [Relations.home, 'home'],
    [Relations.comment, 'comment'],
]

type RelationValueCases = [
    [Relations.home, IdedEntity<Home> | undefined],
    [Relations.comment, IdedEntity<Comment>],
]

export type HomeComment<R extends string[] = []> = Pretify<
    Entity<
        {
            id: number
        } & {
            [K in [
                ...R,
                Relations.comment,
                Relations.home,
            ][number] as TypeSwitch<K, RelationKeyCases>]: TypeSwitch<
                K,
                RelationValueCases
            >
        } & {
            [O in RelationCases[number] as O['value'] extends {
                [IdedSymbol]: true
            }
                ? `${O['key']}Id`
                : never]: number
        }
    >
>

export default Relations
