import { getUsers } from '@/actions/Users'
import { PaginationFilter } from '@/types/filters'
import { Uuidable } from '@/types/index'

export type DType = Uuidable<Awaited<ReturnType<typeof getUsers>>[number]>

export async function usersAccessor(filter?: PaginationFilter) {
    return (await getUsers(filter)) as DType[]
}
