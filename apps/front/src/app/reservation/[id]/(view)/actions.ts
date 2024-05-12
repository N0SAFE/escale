'use server'

import { xiorInstance } from '@/utils/xiorInstance'
import {
    DatesFilter,
    GroupsFilter,
    PaginationFilter,
    SearchFilter,
} from '@/types/filters'
import { Availability, Reservation, Spa, Unavailability } from '@/types/index'
import { DateTime } from 'luxon'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import { DateRange } from 'react-day-picker'

export async function getSpa(id: number) {
    const { data } = await xiorInstance.get<Spa<true>>(`/spas/${id}`)
    return { data }
}

export async function getPrice(
    id: number,
    date: DateRange,
    type: 'night' | 'journey'
) {
    const d = {
        from: DateTime.fromJSDate((date as DateRange).from!).toISODate()!,
        to: !date.to
            ? DateTime.fromJSDate((date as DateRange).from!).toISODate()!
            : DateTime.fromJSDate((date as DateRange).to!).toISODate()!,
    }
    const response = await xiorInstance.get<{
        price: number
        details: { toPrice: { price: number; number: number }[] }
    }>(
        `/reservations/price?startAt=${d.from}&endAt=${d.to}&spa=${id}&type=${type}`
    )
    return {
        data: response.data,
    }
    //  else {
    //     const d = DateTime.fromJSDate(date as Date).toISODate()!
    //     const response = await xiorInstance.get(`/reservations/price?date=${d}&type=${type}&spa=${id}`);
    //     return {
    //         data: response.data.price
    //     };
    // }
}

export async function getSessionUrl(
    id: number,
    selected: 'night' | 'journey' | undefined,
    dates: {
        from: string
        to?: string
    }
): Promise<string> {
    if (!dates.to) {
        dates.to = dates.from
    }
    const session = await xiorInstance.post('/checkout-session/spa', {
        spa: 1,
        startAt: dates.from,
        endAt: dates.to,
        successUrl:
            process.env.NEXT_PUBLIC_FRONT_URL +
            '/reservation/' +
            id +
            '/confirm',
        cancelUrl: process.env.NEXT_PUBLIC_FRONT_URL + '/reservation/' + id,
    })

    return session.data.url as string
}

export async function getAvailabilities(
    filter: GroupsFilter & SearchFilter & DatesFilter & PaginationFilter
) {
    const { data } = await xiorInstance.get<Availability[]>(`/availabilities`, {
        params: {
            groups: filter.groups,
            ...filter.search,
            ...filter.dates,
            limit: filter.limit,
            page: filter.page,
        },
    })
    return data
}

export async function getReservations(
    id: number,
    startAt: string,
    endAt: string
) {
    const { data } = await xiorInstance.get<Reservation[]>(
        `/reservations?startAt=${startAt}&endAt=${endAt}&spa=${id}`
    )
    return data
}

export async function getClosestUnavailabilities(date: string) {
    const closestUnavailabilitiesPromise = await Promise.all([
        await xiorInstance.get<Unavailability[]>(`/unavailabilities`, {
            params: {
                endAt: {
                    strictly_before: date,
                },
                limit: 1,
                order: {
                    startAt: 'desc',
                },
            },
        }),
        await xiorInstance.get<Unavailability[]>(`/unavailabilities`, {
            params: {
                startAt: {
                    strictly_after: date,
                },
                limit: 1,
            },
        }),
    ])

    const closestReservationsPromise = Promise.all([
        await xiorInstance.get<Reservation[]>(`/reservations`, {
            params: {
                endAt: {
                    before: date,
                },
                limit: 1,
                order: {
                    startAt: 'desc',
                },
            },
        }),
        await xiorInstance.get<Reservation[]>(`/reservations`, {
            params: {
                startAt: {
                    after: date,
                },
                limit: 1,
            },
        }),
    ])

    const [
        [upResponseUnavailatilies, downResponseUnavailatilies],
        [upResponseReservations, downResponseReservations],
    ] = await Promise.all([
        closestUnavailabilitiesPromise,
        closestReservationsPromise,
    ])

    return {
        unavailabilities: {
            up: upResponseUnavailatilies.data?.[0] as
                | Unavailability
                | undefined,
            down: downResponseUnavailatilies.data?.[0] as
                | Unavailability
                | undefined,
        },
        reservations: {
            up: upResponseReservations.data?.[0] as Reservation | undefined,
            down: downResponseReservations.data?.[0] as Reservation | undefined,
        },
    }
}

export async function getAvailableDates(
    spa: number,
    from: string,
    to: string,
    {
        includeExternalBlockedCalendarEvents,
        includeExternalReservedCalendarEvents,
        includeReservations,
        includeAvailabilities,
    }: {
        includeExternalBlockedCalendarEvents?: boolean
        includeExternalReservedCalendarEvents?: boolean
        includeReservations?: boolean
        includeAvailabilities?: boolean
    } = {}
) {
    'use server'

    const { data } = await xiorInstance.get<
        {
            date: string
            isAvailable: boolean
            partial: false | 'departure' | 'arrival'
            details: {
                noAvailability: boolean
                dayStart:
                    | 'reservation'
                    | 'external blocked'
                    | 'external reserved'
                dayEnd: 'reservation' | 'external blocked' | 'external reserved'
                dayFull:
                    | 'reservation'
                    | 'external blocked'
                    | 'external reserved'
            }
        }[]
    >(`/reservations/reservable`, {
        params: {
            spa,
            from,
            to,
            includeExternalBlockedCalendarEvents,
            includeExternalReservedCalendarEvents,
            includeReservations,
            includeAvailabilities,
        },
    })

    return data
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
