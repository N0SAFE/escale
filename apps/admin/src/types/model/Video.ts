import { Entity, IdedEntity, IdedSymbol, TypeSwitch } from './utils'
import { VideoSource } from './VideoSource'
import { Pretify } from '../utils'

export enum Relations {
    sources = 'video:sources',
}

type RelationKeyCases = [[Relations.sources, 'sources']]
type RelationValueCases = [[Relations.sources, VideoSource[]]]

export type Video<R extends string[] = []> = Pretify<
    IdedEntity<
        Entity<
            {
                id: number
                alt: string
            } & {
                [K in R[number] as TypeSwitch<K, RelationKeyCases>]: TypeSwitch<
                    K,
                    RelationValueCases
                >
            }
        >
    >
>

export type CreateVideo = Omit<Video, 'id'> & {
    sources: Blob[]
}

export type UpdateVideo = Partial<Omit<Video, 'id'>>

export default Relations
