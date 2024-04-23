import { Entity, IdedEntity } from './utils'

export type File<Relation extends string[] = []> = IdedEntity<
    Entity<{
        id: number
        uuid: string
        name: string
        extname: string
        size: number
        path: string
    }>
>
