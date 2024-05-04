'use server'

import {
    DatesFilter,
    GroupsFilter,
    SearchFilter,
    OrderFilter,
} from '@/types/filters'
import {
    CreateReservation,
    ExternalBlockedCalendarEvent,
    ExternalReservedCalendarEvent,
    Reservation,
    Unavailability,
    UpdateReservation,
} from '@/types/index'
import { xiorInstance } from '@/utils/xiorInstance'

export async function getUnreservableData(
    spa: number,
    from: string,
    to: string
) {
    'use server'

    const { data } = await xiorInstance.get<{
        reservations: Reservation[]
        blockedEvents?: ExternalBlockedCalendarEvent[]
        reservedEvents?: ExternalReservedCalendarEvent[]
        unavailabilities?: {
            availabilityPastLimit: string
            availabilityFutureLimit: string
            data: Unavailability[]
        }
    }>('/reservations/unreservable', {
        params: {
            spa,
            from,
            to,
        },
    })
    return data
}

export async function getExternalBlockedCalendarEvent(id: number) {
    'use server'

    const { data } = await xiorInstance.get<ExternalBlockedCalendarEvent[]>(
        `/external-calendars/${id}/events/blocked`
    )
    return data
}

export async function getExternalReservedCalendarEvent(id: number) {
    'use server'

    const { data } = await xiorInstance.get<ExternalReservedCalendarEvent[]>(
        `/external-calendars/${id}/events/reserved`
    )
    return data
}

export async function getReservations(
    filter: GroupsFilter & SearchFilter & DatesFilter = {},
    signal?: AbortSignal
) {
    'use server'

    const { data } = await xiorInstance.get<Reservation[]>('/reservations', {
        params: {
            groups: filter.groups,
            ...filter.search,
            ...filter.dates,
        },
        signal,
    })
    return data
}

export async function getClosestReservations(
    date: string,
    filter: GroupsFilter &
        SearchFilter &
        OrderFilter & { avoidIds?: number[] } = {}
) {
    'use server'

    const [upResponse, downResponse] = await Promise.all([
        xiorInstance.get<Reservation[]>('/reservations', {
            params: {
                groups: filter.groups,
                ...filter.search,
                startAt: {
                    ...(filter.search?.endAt as any),
                    strictly_before: date,
                },
                limit: 1,
                order: {
                    ...filter?.order,
                    startAt: 'desc',
                },
                notInIds: filter.avoidIds,
            },
        }),
        xiorInstance.get<Reservation[]>('/reservations', {
            params: {
                groups: filter.groups,
                ...filter.search,
                startAt: {
                    ...(filter.search?.startAt as any),
                    after: date,
                },
                limit: 1,
                notInIds: filter.avoidIds,
            },
        }),
    ])
    return {
        up: upResponse.data?.[0],
        down: downResponse.data?.[0],
    }
}

export async function getClosestUnreservable(
    spa: number,
    date: string,
    avoidIds?: number[],
    includes?: {
        includeExternalBlockedCalendarEvents?: boolean
        includeExternalReservedCalendarEvents?: boolean
        includeUnavailabilities?: boolean
    }
) {
    'use server'

    const { data } = await xiorInstance.get<{
        past?: string
        future?: string
    }>(`/reservations/closest-unreservable`, {
        params: {
            spa,
            date,
            avoidIds,
            ...includes,
        },
    })

    return data
}

export async function getReservation(id: number) {
    'use server'

    const { data } = await xiorInstance.get<Reservation>(`/reservations/${id}`)
    return data
}

export async function createReservation(data: CreateReservation) {
    'use server'

    await xiorInstance.post<CreateReservation>('/reservations', data)
}

export async function updateReservation(id: number, data?: UpdateReservation) {
    'use server'

    if (!data) {
        return
    }
    const transformedData = {
        ...data,
    }
    await xiorInstance.patch(`/reservations/${id}`, transformedData)
}

export async function deleteReservation(id: number) {
    'use server'

    await xiorInstance.delete(`/reservations/${id}`)
}
