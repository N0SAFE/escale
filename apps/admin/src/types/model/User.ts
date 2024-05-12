import { Pretify } from '../utils'
import { Image } from './Image'
import { Role } from './Roles'
import { Entity } from './utils'

export type User<
    Relations extends string[] = [],
    Nullable extends null | false = false
> = Pretify<
    Entity<{
        id: number
        email: string
        roles: Role[]
        username: string
        avatar: Image
        address: string
    }>
>

export type CreateUser = {
    email: string
    password: string
}

export type UpdateUser = Partial<Omit<User, 'id'>>
