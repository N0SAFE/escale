'use server'

import { xiorInstance } from '@/utils/xiorInstance'
import { getSpas } from '@/actions/Spa'
import { getServices } from '@/actions/Service'
import { getImages } from '@/actions/Image'

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
        avoidIds,
    }: {
        includeExternalBlockedCalendarEvents?: boolean
        includeExternalReservedCalendarEvents?: boolean
        includeReservations?: boolean
        includeAvailabilities?: boolean
        avoidIds?: number[]
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
            avoidReservationIds: avoidIds,
        },
    })

    return data
}

export async function getVideos() {
    'use server'

    return xiorInstance.get('/videos').then(function (videos) {
        return videos
    })
}

export async function getSourcesByVideoId(videoId: number) {
    'use server'

    return xiorInstance
        .get(`/videos/${videoId}/sources`)
        .then(function (sources) {
            return sources
        })
}
