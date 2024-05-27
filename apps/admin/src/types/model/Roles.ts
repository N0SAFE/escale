import { Pretify } from '../utils'
import { Image } from './Image'
import { Entity } from './utils'

export type Role<
    Relations extends string[] = [],
    Nullable extends null | false = false,
> = Pretify<
    Entity<{
        id: number
        label: string
        description: string
        isAdmin: boolean
        isDefault: boolean
        isActive: boolean
        deletedAt: Date | null
    }>
>

export type CreateRole = Omit<Role, 'id'>

export type UpdateRole = Partial<Omit<Role, 'id'>>
