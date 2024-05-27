import {
    DatesFilter,
    GroupsFilter,
    SearchFilter,
    OrderFilter,
    PropertyFilter,
} from '@/types/filters'
import {
    CreateReservation,
    Reservation,
    UpdateReservation,
} from '@/types/model/Reservation'
import { xiorInstance } from '@/utils/xiorInstance'
import { ExternalCalendarEvents } from '@/types/model/ExternalCalendarEvents'

export async function getCalendarEvents(
    calendarId: number,
    { from, to }: { from: string; to: string },
    filter: GroupsFilter & PropertyFilter & SearchFilter & DatesFilter = {}
) {
    const { data } = await xiorInstance.get<ExternalCalendarEvents[]>(
        `/external-calendars/${calendarId}/events`,
        {
            params: {
                startAt: from,
                endAt: to,
                groups: filter.groups,
                ...filter.search,
                ...filter.dates,
                ...filter.property,
            },
            cache: 'no-store',
        }
    )
    return data
}

export async function getReservations<R extends string[]>(
    filter: GroupsFilter & SearchFilter & DatesFilter = {}
) {
    console.log('before xior reservations request')
    const req = xiorInstance.get<Reservation<R>[]>('/reservations', {
        params: {
            groups: filter.groups,
            ...filter.search,
            ...filter.dates,
        },
        cache: 'no-store',
    })
    console.log(req)
    console.log(await req)
    const { data } = await req
    return data
}

export async function getClosestReservations(
    date: string,
    filter: GroupsFilter &
        SearchFilter &
        OrderFilter & { avoidIds?: number[] } = {}
) {
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
            cache: 'no-store',
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
            cache: 'no-store',
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
    const { data } = await xiorInstance.get<{
        past?: string
        future?: string
    }>(`/reservations/closest-unreservable`, {
        params: {
            spa,
            date,
            avoidIds: avoidIds || [],
            ...includes,
        },
        cache: 'no-store',
    })

    return data
}

export async function getReservation(id: number) {
    const { data } = await xiorInstance.get<Reservation>(
        `/reservations/${id}`,
        { cache: 'no-store' }
    )
    return data
}

export async function createReservation(data: CreateReservation) {
    await xiorInstance.post<CreateReservation>('/reservations', data, {
        cache: 'no-store',
    })
}

export async function updateReservation(id: number, data?: UpdateReservation) {
    if (!data) {
        return
    }
    const transformedData = {
        ...data,
    }
    await xiorInstance.patch(`/reservations/${id}`, transformedData, {
        cache: 'no-store',
    })
}

export async function deleteReservation(id: number) {
    await xiorInstance.delete(`/reservations/${id}`, { cache: 'no-store' })
}
