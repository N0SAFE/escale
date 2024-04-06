'use server'

import { axiosInstance } from '@/lib/axiosInstance'
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
    try {
        const { data } = await axiosInstance<Spa<true>>(`/spas/${id}`)
        return { data }
    } catch (error) {
        console.log(error)
        return { error }
    }
}

export async function getPrice(
    id: number,
    date: DateRange,
    type: 'night' | 'journey'
) {
    try {
        const d = {
            from: DateTime.fromJSDate((date as DateRange).from!).toISODate()!,
            to: !date.to
                ? DateTime.fromJSDate((date as DateRange).from!).toISODate()!
                : DateTime.fromJSDate((date as DateRange).to!).toISODate()!,
        }
        const response = await axiosInstance.get<{
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
        //     const response = await axiosInstance.get(`/reservations/price?date=${d}&type=${type}&spa=${id}`);
        //     return {
        //         data: response.data.price
        //     };
        // }
    } catch (error) {
        console.log(error)
        return { error }
    }
}

export async function getSessionUrl(
    id: number,
    selected: 'night' | 'journey' | undefined,
    date: DateRange
): Promise<string> {
    if (!date.to) {
        date.to = date.from
    }
    const session = await axiosInstance.post('/checkout-session/spa', {
        spa: 1,
        startAt: DateTime.fromJSDate(date.from!).toISODate(),
        endAt: DateTime.fromJSDate(date.to!).toISODate(),
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
    const { data } = await axiosInstance.get<Availability[]>(
        `/availabilities`,
        {
            params: {
                groups: filter.groups,
                ...filter.search,
                ...filter.dates,
                limit: filter.limit,
                page: filter.page,
            },
        }
    )
    return data
}

export async function getReservations(
    id: number,
    startAt: string,
    endAt: string
) {
    const { data } = await axiosInstance.get<Reservation[]>(
        `/reservations?startAt=${startAt}&endAt=${endAt}&spa=${id}`
    )
    return data
}

export async function getClosestUnavailabilities(date: string) {
    const closestUnavailabilitiesPromise = await Promise.all([
        await axiosInstance.get<Unavailability[]>(`/unavailabilities`, {
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
        await axiosInstance.get<Unavailability[]>(`/unavailabilities`, {
            params: {
                startAt: {
                    strictly_after: date,
                },
                limit: 1,
            },
        }),
    ])

    const closestReservationsPromise = Promise.all([
        await axiosInstance.get<Reservation[]>(`/reservations`, {
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
        await axiosInstance.get<Reservation[]>(`/reservations`, {
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

    const { data } = await axiosInstance.get<
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

    const { data } = await axiosInstance.get<{
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
