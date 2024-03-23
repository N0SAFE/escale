'use server'

import {
    DatesFilter,
    GroupsFilter,
    SearchFilter,
    OrderFilter,
} from '@/types/filters'
import {
    CreateReservation,
    Reservation,
    UpdateReservation,
} from '@/types/index'
import { axiosInstance } from '@/utils/axiosInstance'

export async function getReservations(
    filter: GroupsFilter & SearchFilter & DatesFilter = {},
    signal?: AbortSignal
) {
    'use server'

    console.log(filter)

    const { data } = await axiosInstance.get<Reservation[]>('/reservations', {
        params: {
            groups: filter.groups,
            ...filter.search,
            ...filter.dates,
        },
        signal,
    })
    console.log(data.length)
    return data
}

export async function getClosestReservations(
    date: string,
    filter: GroupsFilter & SearchFilter & OrderFilter = {}
) {
    'use server'

    const [upResponse, downResponse] = await Promise.all([
        axiosInstance.get<Reservation[]>('/reservations', {
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
        axiosInstance.get<Reservation[]>('/reservations', {
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
            up: upResponse.data?.[0],
            down: downResponse.data?.[0],
        },
    }
}

export async function getReservation(id: number) {
    'use server'

    try {
        const { data } = await axiosInstance.get<Reservation>(
            `/reservations/${id}`
        )
        return { data }
    } catch (error) {
        return { error }
    }
}

export async function createReservation(data: CreateReservation) {
    'use server'

    // console.log(Array.from(data.entries()))

    console.log(data)

    await axiosInstance
        .post<CreateReservation>('/reservations', data)
        .catch((e) => {
            console.log(e.response.data)
        })
}

export async function updateReservation(id: number, data?: UpdateReservation) {
    'use server'

    if (!data) {
        return
    }
    const transformedData = {
        ...data,
    }
    console.log(transformedData)
    await axiosInstance
        .patch(`/reservations/${id}`, transformedData)
        .catch(function (e) {
            throw e
        })
}

export async function deleteReservation(id: number) {
    'use server'

    await axiosInstance.delete(`/reservations/${id}`)
}
