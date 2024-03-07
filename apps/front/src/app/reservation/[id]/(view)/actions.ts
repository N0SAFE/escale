import { Availability, Reservation, Spa } from '@/types/index'
import axios from 'axios'
import { DateTime } from 'luxon'
import { isRedirectError } from 'next/dist/client/components/redirect'
import { redirect } from 'next/navigation'
import { DateRange } from 'react-day-picker'

export async function getSpa(id: number) {
    try {
        const { data } = await axios<Spa<true>>(`/spas/${id}`)
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
        const response = await axios.get<{
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
        //     const response = await axios.get(`/reservations/price?date=${d}&type=${type}&spa=${id}`);
        //     return {
        //         data: response.data.price
        //     };
        // }
    } catch (error) {
        console.log(error)
        return { error }
    }
}

export async function getAvailableDates(
    id: number,
    type: 'night' | 'journey',
    startAt: string,
    endAt?: string
) {
    try {
        if (!endAt) endAt = startAt
        const data = await axios.get<{ date: string; available: boolean }[]>(
            `/reservations/available-dates?startAt=${startAt}&endAt=${endAt}&type=${type}&spa=${id}`
        )
        return {
            data: new Set(
                data.data
                    .filter((date) => date.available)
                    .map((date) => date.date)
            ),
        }
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
    const session = await axios.post('/checkout-session/spa', {
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
    id: number,
    startAt: string,
    endAt: string
) {
    try {
        const { data } = await axios.get<Availability[]>(
            `/availabilities?startAt=${startAt}&endAt=${endAt}&spa=${id}`
        )
        return {
            data: data,
        }
    } catch (error) {
        console.log(error)
        return { error }
    }
}

export async function getReservations(
    id: number,
    startAt: string,
    endAt: string
) {
    try {
        const { data } = await axios.get<Reservation[]>(
            `/reservations?startAt=${startAt}&endAt=${endAt}&spa=${id}`
        )
        return {
            data: data,
        }
    } catch (error) {
        console.log(error)
        return { error }
    }
}
