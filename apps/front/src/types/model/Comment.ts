import { User } from './User'
import { Entity, IdedEntity } from './utils'

export type Comment = Readonly<
    Entity<{
        id: number
        text: string
        user: IdedEntity<User>
    }>
>
