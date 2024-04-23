import { Pretify } from '../utils'
import { File } from './File'
import { Entity, IdedEntity, UnwrapEntity } from './utils'

export type Image<
    Relations extends string[] = [],
    Nullable extends null | false = false
> = Pretify<
    IdedEntity<
        Entity<{
            id: number
            alt: string
            file: File
        }>,
        Nullable
    >
>

export type CreateImage = Pretify<
    Omit<UnwrapEntity<Image>, 'id' | 'file' | 'fileId'> & {
        file?: Blob
        name?: string
    }
>

export type UpdateImage = Partial<
    Omit<Image, 'id' | 'file'> & {
        name: string
    }
>
