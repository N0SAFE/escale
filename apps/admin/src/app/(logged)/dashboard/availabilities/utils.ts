import { Uuidable } from '@/types/index'
import Relations from '@/types/model/Availability'
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
import { getAvailabilities } from '@/actions/Availability/index'

export type DType = Uuidable<
    Awaited<
        ReturnType<typeof getAvailabilities<[typeof Relations.spa]>>
    >[number]
>

export async function availabilitiesAccessor({
    groups,
    ...filters
}: Pretify<
    GroupsFilter &
        SearchFilter &
        PropertyFilter &
        PaginationFilter &
        DatesFilter
> = {}) {
    return (await getAvailabilities({
        groups: ['availabilities:spa', ...(groups ?? [])],
        ...filters,
    }).then((availabilities) =>
        availabilities.map((s) => ({ ...s, uuid: s.id }))
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
