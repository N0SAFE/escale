import { VerifyContext, VerifyRelationCases } from '../index'
import { Pretify } from '../utils'
import { Image, Context as ImageContext } from './Image'
import { Entity, TypeSwitch, IdedSymbol } from './utils'

export const Relations = {
    image: 'home:image',
} as const

type RelationCases<R extends string[] = []> = VerifyRelationCases<
    [
        {
            key: 'image'
            context: ImageContext<R>
            relationKey: typeof Relations.image
        },
    ]
>

export type Service<R extends string[] = []> = Entity<
    {
        id: number
        label: string
        description: string
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

export type CreateService = Omit<Service, 'id'>

export type UpdateService = Partial<Omit<Service, 'id'>>

export type Context<R extends string[] = []> = Pretify<
    VerifyContext<{
        relations: typeof Relations
        relationCases: RelationCases<R>
        model: Service<R>
    }>
>

export default Relations
