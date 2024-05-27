import { Entity, IdedEntity, IdedSymbol, TypeSwitch } from './utils'
import { Video } from './Video'
import { Pretify } from '../utils'
import { File } from './File'

export enum VideoSourceRelation {
    video = 'videoSource:video',
}

type RelationCases = [
    {
        key: 'video' // @ts-ignore
        value: Video
    },
]

type RelationKeyCases = [[VideoSourceRelation.video, 'video']]
// @ts-ignore
type RelationValueCases = [[VideoSourceRelation.video, Video]]

// @ts-ignore
export type VideoSource<R extends string[] = []> = Pretify<
    Entity<{
        id: number
        path: string
        file: File
    }> & {
        [K in R[number] as TypeSwitch<K, RelationKeyCases>]: TypeSwitch<
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

export type CreateVideoSource = Omit<VideoSource, 'id' | 'file'> & {
    file: Blob
    name?: string
}

export type UpdateVideoSource = Partial<Omit<VideoSource, 'id' | 'file'>> & {
    name?: string
}
