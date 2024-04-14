// the T generics on the typed model is used to define where the model is the top level called
// if i get the mode Spa i want to have some extra prop that are not fetch by default

import { v4 as uuid } from 'uuid'
import { IdedEntity, Entity, UnwrapEntity, Pretify } from './utils';

export type File = IdedEntity<
    Entity<{
        id: number
        uuid: string
        name: string
        extname: string
        size: number
        path: string
    }>
>

export type Video<Nullable extends null | false = false> = IdedEntity<
    Entity<{
        id: number
        alt: string
        file: File
    }>,
    Nullable
>

export type CreateVideo = Omit<Video, 'id' | 'file'> & {
    file: Blob
    name?: string
}

export type UpdateVideo = Partial<Omit<Video, 'id' | 'file'>> & {
    name?: string
}

export type Image<Nullable extends null | false = false> = Pretify<IdedEntity<
    Entity<{
        id: number
        alt: string
        file: File
    }>,
    Nullable
>>

export type CreateImage = Pretify<Omit<UnwrapEntity<Image>, 'id' | 'file' | 'fileId'> & {
    file?: Blob
    name?: string
}>

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

export type Availability<T extends boolean = false> = Entity<{
    id: number
    startAt: string
    endAt: string
    spa: IdedEntity<Spa>
    monPrice: Price
    tuePrice: Price
    wedPrice: Price
    thuPrice: Price
    friPrice: Price
    satPrice: Price
    sunPrice: Price
}>

export type UpdateAvailability = Partial<
    Omit<Availability, 'id' | 'spa'> & {
        spa: number
    }
>

export type CreateAvailability = Omit<Availability, 'id' | 'spa' | 'spaId'> & {
    spa: number
}

export type Faq = Entity<{
    id: number
    question: string
    answer: string
    rank: number
}>

export type Comment = Readonly<{
    id: number
    text: string
}>

export type CreateFaq = Omit<Faq, 'id'>

export type UpdateFaq = Partial<Omit<Faq, 'id'>>

export type Home = Entity<{
    description: string
    image?: Image
    video?: Video
    comments: IdedEntity<Comment[]>
}>

export type UpdateHome = Partial<UnwrapEntity<Home>>

export type Unavailability<T extends boolean = false> = {
    id: number
    startAt: string
    endAt: string
    spaId: number
    spa: Spa
}

export type ExternalCalendar = Readonly<{
    id: number
    airbnbCalendarUrl: string
    bookingCalendarUrl: string
}>

export type ExternalCalendarEvent = Readonly<{
    id: number
    type: 'blocked' | 'reserved'
    from: 'airbnb' | 'booking'
    startAt: string
    endAt: string
    externalCalendar: ExternalCalendar
}>

export type ExternalAirbnbCalendarEvent = Readonly<
    Omit<ExternalCalendarEvent, 'from'> & {
        from: 'airbnb'
    }
>

export type ExternalBookingCalendarEvent = Readonly<
    Omit<ExternalCalendarEvent, 'from'> & {
        from: 'booking'
    }
>

export type ExternalBlockedCalendarEvent = Readonly<
    Omit<ExternalCalendarEvent, 'type'> & {
        type: 'blocked'
    }
>

export type ExternalReservedCalendarEvent = Readonly<
    Omit<ExternalCalendarEvent, 'type'> & {
        type: 'reserved'
    }
>

export type Editable<T> = {
    isDeleted: boolean
    isEdited: boolean
    isNew: boolean
    data: T
}

export type Uuidable<T extends {}> = T & {
    uuid: ReturnType<typeof uuid>
}
