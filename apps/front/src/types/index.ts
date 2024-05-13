// the T generics on the typed model is used to define where the model is the top level called
// if i get the mode Spa i want to have some extra prop that are not fetch by default

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
    path: string
}

export type SpaImage = {
    id: number
    order: number
    image: Image
}

export type Spa<T extends boolean = false> = {
    id: number
    title: string
    description: string
    location: string
    googleMapsLink: string
} & (T extends true ? { spaImages: SpaImage[]; services: Service[] } : {})

export type Service<T extends boolean = false> = {
    id: number
    label: string
    description: string
    image: Image
}

export type Reservation<T extends boolean = false> = {
    id: number
    startAt: string
    endAt: string
    spa: Spa
}

export type AvailabilityPrice = {
    day: number
    night: number
    journey: number
}

export type Availability<T extends boolean = false> = {
    id: number
    startAt: string
    endAt: string
    spa: Spa
    monPrice: AvailabilityPrice
    tuePrice: AvailabilityPrice
    wedPrice: AvailabilityPrice
    thuPrice: AvailabilityPrice
    friPrice: AvailabilityPrice
    satPrice: AvailabilityPrice
    sunPrice: AvailabilityPrice
}

export type Unavailability<T extends boolean = false> = {
    id: number
    startAt: string
    endAt: string
    spa: Spa
}
