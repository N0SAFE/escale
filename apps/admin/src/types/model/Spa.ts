import { VerifyContext, VerifyRelationCases } from '../index'
import { Pretify } from '../utils'
import {
    ExternalCalendar,
    Context as ExternalCalendarContext,
} from './ExternalCalendar'
import { Image } from './Image'
import { Service, Context as ServiceContext } from './Service'
import {
    SpaImage,
    Context as SpaImageContext,
    Relations as SpaImageRelations,
} from './SpaImage'
import { Entity, TypeSwitch, IdedSymbol } from './utils'

export const Relations = {
    spaImage: 'spa:spaImage',
    externalCalendar: 'spa:externalCalendar',
    services: 'spa:services',
} as const

type RelationCases<R extends string[] = []> = VerifyRelationCases<
    [
        {
            key: 'spaImage'
            context: SpaImageContext<R>
            relationKey: typeof Relations.spaImage
        },
        {
            key: 'externalCalendar'
            context: ExternalCalendarContext<R>
            relationKey: typeof Relations.externalCalendar
        },
        {
            key: 'services'
            context: ServiceContext<R>
            relationKey: typeof Relations.services
        },
    ]
>

export type Spa<R extends string[] = []> = Entity<
    {
        id: number
        title: string
        description: string
        location: string
        googleMapsLink: string
    } & {
        [O in RelationCases<R>[number] as O['relationKey'] extends R[number]
            ? O['key']
            : never]: O['context']['model']
    } & {
        [O in RelationCases[number] as O['context']['model'] extends {
            [IdedSymbol]: true
        }
            ? `${O['key']}Id`
            : never]: number
    }
>

export type CreateSpa = Omit<Spa, 'id'> & {
    spaImages: SpaImage<[typeof SpaImageRelations.image]>[]
    services: Service[]
}

export type UpdateSpa = Partial<Omit<Spa, 'id'>> & {
    spaImages?: SpaImage<[typeof SpaImageRelations.image]>[]
    services?: Service[]
}

export type Context<R extends string[] = []> = Pretify<
    VerifyContext<{
        relations: typeof Relations
        relationCases: RelationCases<R>
        model: Spa<R>
    }>
>

export default Relations
