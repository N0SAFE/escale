import { VerifyContext, VerifyRelationCases } from '../index'
import { Pretify } from '../utils'
import { Image } from './Image'
import { Entity, TypeSwitch, IdedSymbol } from './utils'

export const Relations = {} as const

type RelationCases<R extends string[] = []> = VerifyRelationCases<[]>

export type ExternalCalendar<R extends string[] = []> = Entity<
    {
        id: number
        airbnbCalendarUrl: string
        bookingCalendarUrl: string
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

export type Context<R extends string[] = []> = Pretify<
    VerifyContext<{
        relations: typeof Relations
        relationCases: RelationCases<R>
        model: ExternalCalendar<R>
    }>
>

export default Relations
