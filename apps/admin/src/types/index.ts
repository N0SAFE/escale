// the T generics on the typed model is used to define where the model is the top level called
// if i get the mode Spa i want to have some extra prop that are not fetch by default

import { Immutable } from './utils'

export type File = {
    id: number
    uuid: string
    name: string
    extname: string
    size: number
    path: string
}

export type Image<T extends boolean = false> = {
    id: number
    alt: string
    file: File
}

export type CreateImage = Omit<Image, 'id' | 'file'> & {
    file?: Blob
    name?: string
}

export type UpdateImage = Partial<
    Omit<Image, 'id' | 'file'> & {
        name: string
    }
>

export type SpaImage = {
    id: number
    order: number
    image: Image
}

export type CreateSpaImage = Omit<SpaImage, 'id'>

export type Spa<T extends boolean = false> = {
    id: number
    title: string
    description: string
    location: string
    googleMapsLink: string
    externalCalendar: ExternalCalendar
} & (T extends true ? { spaImages: SpaImage[]; services: Service[] } : {})

export type CreateSpa = Omit<Spa<true>, 'id' | 'externalCalendar'>

export type UpdateSpa = Partial<Omit<Spa<true>, 'id' | 'externalCalendar'>>

export type Service<T extends boolean = false> = {
    id: number
    label: string
    description: string
    image?: Image
}

export type CreateService = Omit<Service, 'id' | 'image'> & {
    image: Image | null
}

export type UpdateService = Partial<Omit<Service, 'id' | 'image'>> & {
    image?: Image | null
}

export type Reservation<T extends boolean = false> = {
    id: number
    startAt: string
    endAt: string
    notes: string
    spaId: number
    spa: Spa
}

export type UpdateReservation = Partial<
    Omit<Reservation, 'id' | 'spa'> & { spa: number }
>

export type CreateReservation = Omit<Reservation, 'id' | 'spa' | 'spaId'> & {
    spa: number
}

export type Price = {
    day: number
    night: number
    journey: number
}

export type Availability<T extends boolean = false> = {
    id: number
    startAt: string
    endAt: string
    spa: Spa
    monPrice: Price
    tuePrice: Price
    wedPrice: Price
    thuPrice: Price
    friPrice: Price
    satPrice: Price
    sunPrice: Price
}

export type UpdateAvailability = Partial<
    Omit<Availability, 'id' | 'spa'> & {
        spa: number
    }
>

export type CreateAvailability = Omit<Availability, 'id' | 'spa'> & {
    spa: number
}

export type Unavailability<T extends boolean = false> = {
    id: number
    startAt: string
    endAt: string
    spaId: number
    spa: Spa
}

export type ExternalCalendar = Immutable<{
    id: number
    airbnbCalendarUrl: string
    bookingCalendarUrl: string
}>

export type ExternalCalendarEvent = Immutable<{
    id: number
    type: 'blocked' | 'reserved'
    from: 'airbnb' | 'booking'
    startAt: string
    endAt: string
    externalCalendar: ExternalCalendar
}>

export type ExternalAirbnbCalendarEvent = Immutable<
    Omit<ExternalCalendarEvent, 'from'> & {
        from: 'airbnb'
    }
>

export type ExternalBookingCalendarEvent = Immutable<
    Omit<ExternalCalendarEvent, 'from'> & {
        from: 'booking'
    }
>

export type ExternalBlockedCalendarEvent = Immutable<
    Omit<ExternalCalendarEvent, 'type'> & {
        type: 'blocked'
    }
>

export type ExternalReservedCalendarEvent = Immutable<
    Omit<ExternalCalendarEvent, 'type'> & {
        type: 'reserved'
    }
>
