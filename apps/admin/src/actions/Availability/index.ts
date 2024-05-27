import {
    DatesFilter,
    GroupsFilter,
    SearchFilter,
    OrderFilter,
} from '@/types/filters'
import {
    Availability,
    CreateAvailability,
    UpdateAvailability,
} from '@/types/model/Availability'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getAvailabilities<R extends string[] = []>(
    filter: GroupsFilter & SearchFilter & DatesFilter = {},
    signal?: AbortSignal
) {
    const { data } = await xiorInstance.get<Availability<R>[]>(
        '/availabilities',
        {
            params: {
                groups: filter.groups,
                ...filter.search,
                ...filter.dates,
            },
            signal,
        }
    )
    return data
}

export async function getClosestAvailabilities(
    spaId: number,
    date: string,
    avoidIds?: number[]
) {
    const [pastResponse, futureResponse] = await Promise.all([
        xiorInstance.get<Availability[]>('/availabilities', {
            params: {
                spaId: spaId,
                endAt: {
                    strictly_before: date,
                },
                avoidIds,
                limit: 1,
                order: {
                    startAt: 'desc',
                },
            },
        }),
        xiorInstance.get<Availability[]>('/availabilities', {
            params: {
                spaId: spaId,
                startAt: {
                    strictly_after: date,
                },
                avoidIds,
                limit: 1,
            },
        }),
    ])
    return {
        past: pastResponse.data?.[0] as Availability | undefined,
        future: futureResponse.data?.[0] as Availability | undefined,
    }
}

export async function getAvailability(id: number) {
    try {
        const { data } = await xiorInstance.get<Availability>(
            `/availabilities/${id}`
        )
        return { data }
    } catch (error) {
        return { error }
    }
}

export async function createAvailability(data: CreateAvailability) {
    await xiorInstance.post<CreateAvailability>('/availabilities', data)
}

export async function updateAvailability(
    id: number,
    data?: UpdateAvailability
) {
    if (!data) {
        return
    }
    const transformedData = {
        ...data,
    }
    await xiorInstance.patch(`/availabilities/${id}`, transformedData)
}

export async function deleteAvailability(id: number) {
    await xiorInstance.delete(`/availabilities/${id}`)
}
