'use server'

import { GroupsFilter, PaginationFilter, SearchFilter } from '@/types/filters'
import { User, CreateUser, UpdateUser } from '@/types/model/User'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getUsers(
    filter: GroupsFilter & SearchFilter & PaginationFilter = {}
) {
    'use server'

    const { data } = await xiorInstance.get<User[]>('/users', {
        params: {
            ...filter.search,
            groups: filter.groups,
            page: filter.page,
            limit: filter.limit,
        },
    })
    return data
}

export async function getUser(id: number) {
    'use server'

    const { data } = await xiorInstance.get<User>(`/users/${id}`)
    return data
}

export async function createUser(data: CreateUser) {
    'use server'

    const transformedData = {
        email: data.email,
        password: data.password,
    }
    await xiorInstance.post<CreateUser>('/users', transformedData)
}

export async function updateUser(id: number, data?: UpdateUser) {
    'use server'

    if (!data) {
        return
    }
    const transformedData = {
        address: data.address,
        avatar: data.avatar,
        email: data.email,
        roles: data.roles,
        username: data.username,
    }
    await xiorInstance.patch<UpdateUser>(`/users/${id}`, transformedData)
}

export async function deleteUser(id: number) {
    'use server'

    await xiorInstance.delete(`/users/${id}`)
}
