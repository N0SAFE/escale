'use server'

import { axiosInstance } from '@/utils/axiosInstance'
import { getSpas } from './spas/actions'
import { getServices } from './services/actions'
import { getImages } from './images/actions'

export { getSpas, getServices, getImages }

export async function getFirstSpa() {
    'use server'

    return getSpas({
        page: 1,
        limit: 1,
    }).then(function (spas) {
        return spas?.[0]
    })
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
