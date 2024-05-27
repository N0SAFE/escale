import { Uuidable } from '@/types/index'
import { getReservations } from './actions'
import Relations, { Context } from '@/types/model/Reservation'
import { getSpas } from '../actions'
import { Spa, Relations as SpaRelations } from '@/types/model/Spa'
import {
    DatesFilter,
    GroupsFilter,
    PaginationFilter,
    PropertyFilter,
    SearchFilter,
} from '@/types/filters'
import { Pretify } from '@/types/utils'

export type DType = Uuidable<
    Awaited<ReturnType<typeof getReservations<[typeof Relations.spa]>>>[number]
>

export async function reservationsAccessor({
    groups,
    ...filters
}: Pretify<
    GroupsFilter &
        SearchFilter &
        PropertyFilter &
        PaginationFilter &
        DatesFilter
> = {}) {
    return (await getReservations({
        groups: ['reservations:spa', ...(groups ?? [])],
        ...filters,
    }).then((reservations) =>
        reservations.map((r) => ({ ...r, uuid: r.id }))
    )) as DType[]
}

export type SpaType = Spa<[typeof SpaRelations.externalCalendar]>

export const spaAccessor = async () => {
    const spas = getSpas({
        groups: [typeof SpaRelations.externalCalendar],
    }) as Promise<SpaType[]>
    return await spas
}

export const querySpaId = 'spaId'
