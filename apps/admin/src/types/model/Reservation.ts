import { VerifyContext, VerifyRelationCases } from '../index'
import { Pretify, UnionToArray } from '../utils'
import { Image } from './Image'
import { Spa, Context as SpaContext } from './Spa'
import { Entity, TypeSwitch, IdedSymbol } from './utils'

const Relations = {
    spa: 'reservation:spa',
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

export type Reservation<R extends string[] = []> = Entity<
    {
        id: number
        startAt: string
        endAt: string
        notes: string
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

export type CreateReservation = Omit<Reservation, 'id'>

export type UpdateReservation = Partial<Omit<Reservation, 'id'>>

export type Context<R extends string[] = []> = Pretify<
    VerifyContext<{
        relations: typeof Relations
        relationCases: RelationCases<R>
        model: Reservation<R>
    }>
>

export default Relations
