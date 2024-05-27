import { GroupsFilter, PaginationFilter, SearchFilter } from '@/types/filters'
import { ApiRessource, PaginationContext } from '@/types/index'
import { User, CreateUser, UpdateUser } from '@/types/model/User'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getUsers(
    filter: GroupsFilter & SearchFilter & PaginationFilter = {}
) {
    // @flag server-side-pagination
    // xiorInstance.get<ApiRessource<User[], [PaginationContext]>>()

    const { data } = await xiorInstance.get<User[]>('/users', {
        params: {
            ...filter.search,
            ...(filter.groups ? { groups: filter.groups } : {}),
            ...(filter.page ? { page: filter.page } : {}),
            ...(filter.limit ? { limit: filter.limit } : {}),
        },
    })
    return data.map((u) => ({
        ...u,
        uuid: u.id,
    }))
}

export async function getUser(id: number) {
    const { data } = await xiorInstance.get<User>(`/users/${id}`)
    return data
}

export async function createUser(data: CreateUser) {
    const transformedData = {
        email: data.email,
        password: data.password,
    }
    await xiorInstance.post<CreateUser>('/users', transformedData)
}

export async function updateUser(id: number, data?: UpdateUser) {
    if (!data) {
        return
    }
    const transformedData = {
        address: data.address,
        avatarId: data.avatarId,
        email: data.email,
        roles: data.roles,
        username: data.username,
    }

    console.log('id', id)
    console.log('transformedData', transformedData)
    await xiorInstance.patch<UpdateUser>(`/users/${id}`, transformedData)
}

export async function deleteUser(id: number) {
    await xiorInstance.delete(`/users/${id}`)
}
