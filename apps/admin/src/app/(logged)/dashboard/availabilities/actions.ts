'use server'

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
} from '@/types/index'
import { axiosInstance } from '@/utils/axiosInstance'

export async function getAvailabilities(
    filter: GroupsFilter & SearchFilter & DatesFilter = {},
    signal?: AbortSignal
) {
    'use server'

    console.log(filter)

    const { data } = await axiosInstance.get<Availability[]>(
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
    console.log(data.length)
    return data
}

export async function getClosestAvailabilities(
    date: string,
    filter: GroupsFilter & SearchFilter & OrderFilter = {}
) {
    'use server'

    const [upResponse, downResponse] = await Promise.all([
        axiosInstance.get<Availability[]>('/availabilities', {
            params: {
                groups: filter.groups,
                ...filter.search,
                endAt: {
                    ...(filter.search?.endAt as any),
                    strictly_before: date,
                },
                limit: 1,
                order: {
                    ...filter?.order,
                    startAt: 'desc',
                },
            },
        }),
        axiosInstance.get<Availability[]>('/availabilities', {
            params: {
                groups: filter.groups,
                ...filter.search,
                startAt: {
                    ...(filter.search?.startAt as any),
                    strictly_after: date,
                },
                limit: 1,
            },
        }),
    ])
    return {
        data: {
            up: upResponse.data?.[0] as Availability | undefined,
            down: downResponse.data?.[0] as Availability | undefined,
        },
    }
}

export async function getAvailability(id: number) {
    'use server'

    try {
        const { data } = await axiosInstance.get<Availability>(
            `/availabilities/${id}`
        )
        return { data }
    } catch (error) {
        return { error }
    }
}

export async function createAvailability(data: CreateAvailability) {
    'use server'

    // console.log(Array.from(data.entries()))

    console.log(data)

    await axiosInstance.post<CreateAvailability>('/availabilities', data)
}

export async function updateAvailability(
    id: number,
    data?: UpdateAvailability
) {
    'use server'

    if (!data) {
        return
    }
    const transformedData = {
        ...data,
    }
    console.log(transformedData)
    await axiosInstance.patch(`/availabilities/${id}`, transformedData)
}

export async function deleteAvailability(id: number) {
    'use server'

    await axiosInstance.delete(`/availabilities/${id}`)
}
