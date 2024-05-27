import { ContextContract } from './index'
import { Context } from './model/Reservation'
import { Pretify, UnionToArray, UnionToIntersection } from './utils'

export type SearchFilter = {
    search?: {
        [key: string]:
            | string
            | number
            | boolean
            | undefined
            | string[]
            | number[]
            | boolean[]
    }
}

export type PropertyFilter = {
    property?: {
        [key: string]: string | number | boolean | undefined
    }
}

export type GroupsFilter<T extends string[] = string[]> = {
    groups?: string[]
}

export type DatesFilter = {
    dates?: {
        [key: string]: {
            after?: string | undefined
            before?: string | undefined
            strictly_after?: string | undefined
            strictly_before?: string | undefined
        }
    }
}

export type PaginationFilter = {
    page?: number
    limit?: number
}

export type OrderFilter = {
    order?: {
        [key: string]: 'asc' | 'desc'
    }
}

// export enum FilterType {
//     Search,
//     Property,
//     Groups,
//     Dates,
//     Pagination,
//     Order,
// }

// type DeepRelationsFromContext<
//     C extends ContextContract,
//     DefaultValue extends number | string = number
// > = DefaultValue extends string
//     ? DefaultValue
//     :
//           | C['relations'][keyof C['relations']]
//           | keyof {
//                 [RelationCases in C['relationCases'] as RelationCases['length'] extends 0
//                     ? never
//                     : DeepRelationsFromContext<
//                           RelationCases[number]['context']
//                       >]: never
//             }

// type FilterMap<C extends ContextContract> = {
//     [FilterType.Search]: SearchFilter
//     [FilterType.Property]: PropertyFilter
//     [FilterType.Groups]: GroupsFilter<C['relations']>
//     [FilterType.Dates]: DatesFilter
//     [FilterType.Pagination]: PaginationFilter
//     [FilterType.Order]: OrderFilter
// }

// export type Filter<
//     T extends FilterType[],
//     C extends ContextContract
// > = UnionToIntersection<FilterMap<C>[T[number]]>

// function test(
//     filter: Filter<[FilterType.Groups, FilterType.Search], Context> = {}
// ) {
//     filter.groups
// }

// test({
//     groups: [],
// })
