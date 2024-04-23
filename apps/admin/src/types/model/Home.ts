import { Image } from './Image'
import { Comment } from './Comment'
import { HomeComment } from './HomeComment'
import {
    Entity,
    IdedEntity,
    TypeSwitch,
    UnwrapEntity,
    IdedSymbol,
} from './utils'
import { Video } from './Video'

enum Relations {
    homeComments = 'home:homeComments',
    video = 'home:video',
    image = 'home:image',
}

type RelationCases = [
    {
        key: 'video'
        value: Video
    },
    {
        key: 'image'
        value: Image
    }
]

type RelationKeyCases = [
    [Relations.homeComments, 'homeComments'],
    [Relations.video, 'video'],
    [Relations.image, 'image']
]
type RelationValueCases<R extends string[] = []> = [
    [Relations.homeComments, HomeComment<Exclude<R, Relations.homeComments>>[]],
    [Relations.video, Video<Exclude<R, Relations.video>>],
    [Relations.image, Image<Exclude<R, Relations.image>>]
]

export type Home<R extends string[] = []> = Entity<
    {
        id: number
        description: string
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

export type UpdateHome = Partial<Omit<UnwrapEntity<Home>, 'homeComments'>> & {
    commentIds: number[]
}

export default Relations
