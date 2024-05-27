import { VerifyContext, VerifyRelationCases } from '../index'
import { Pretify, UnionToArray } from '../utils'
import { Image } from './Image'
import { Spa, Context as SpaContext } from './Spa'
import { Entity, TypeSwitch, IdedSymbol } from './utils'

export type Price = {
    day: number
    night: number
    journey: number
}

const Relations = {
    spa: 'availability:spa',
} as const

type RelationCases<R extends string[] = []> = VerifyRelationCases<
    [
        {
            key: 'spa'
            context: SpaContext<R>
            relationKey: typeof Relations.spa
        },
    ]
>

export type Availability<R extends string[] = []> = Entity<
    {
        id: number
        startAt: string
        endAt: string
        monPrice: Price
        tuePrice: Price
        wedPrice: Price
        thuPrice: Price
        friPrice: Price
        satPrice: Price
        sunPrice: Price
        spaId: number
    } & {
        [O in RelationCases<R>[number] as O['relationKey'] extends R[number]
            ? O['key']
            : never]: O['context']['model']
    } & {
        [O in RelationCases<R>[number] as O['context']['model'] extends {
            [IdedSymbol]: true
        }
            ? `${O['key']}Id`
            : never]: number
    }
>

export type CreateAvailability = Omit<Availability, 'id'>

export type UpdateAvailability = Partial<Omit<Availability, 'id'>>

export type Context<R extends string[] = []> = Pretify<
    VerifyContext<{
        relations: typeof Relations
        relationCases: RelationCases<R>
        model: Availability<R>
    }>
>

export default Relations
