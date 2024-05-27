// the T generics on the typed model is used to define where the model is the top level called
// if i get the mode Spa i want to have some extra prop that are not fetch by default

import { v4 as uuid } from 'uuid'
import { IdedEntity, Entity, UnwrapEntity } from './model/utils'
import { Pretify } from './utils'

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

export type Image<Nullable extends null | false = false> = Pretify<
    IdedEntity<
        Entity<{
            id: number
            alt: string
            file: File
            path: string
        }>,
        Nullable
    >
>

export type CreateImage = Pretify<
    Omit<UnwrapEntity<Image>, 'id' | 'file' | 'fileId' | 'path'> & {
        file?: Blob
        name?: string
    }
>

export type UpdateImage = Partial<
    Omit<Image, 'id' | 'file' | 'path'> & {
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

export type CreateFaq = Omit<Faq, 'id'>

export type UpdateFaq = Partial<Omit<Faq, 'id'>>

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

export type Orderable<T extends {}> = T & {
    $order: number
}

export type ApiRessource<T, C extends any[]> = {
    data: T
    context: C[number]
}

export type PaginationContext = {
    paginator: {
        total: number
        per_page: number
        current_page: number
        last_page: number
        first_page: number
        first_page_url: string
        last_page_url: string
        next_page_url: string
        previous_page_url: string
    }
}

export type relationName = string
export type relationValue = string
export type externalModel<T extends string[] = []> = any
export type RelationsContract = Record<string, string>
export type RelationCasesContract<R extends string[] = []> = {
    key: string
    context: ContextContract<R>
    relationKey: relationValue
}[]
export type RelationKeyCasesContract = [relationValue, string][]
export type RelationValueCasesContract<R extends string[] = []> = [
    relationValue,
    externalModel<Exclude<R, relationValue>>,
][]

export type model = Entity<{}>

export type ContextContract<R extends string[] = []> = {
    relations: RelationsContract
    relationCases: RelationCasesContract<R>
    model: model
}

export type VerifyRelationCases<T extends RelationCasesContract> = T
export type VerifyContext<T extends ContextContract> = T
