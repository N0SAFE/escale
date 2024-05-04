import type { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
import { CustomBaseModelFilter } from './CustomBaseModelFilter'
import { RecursiveValue, preloadQuery, relationPathExists } from './utils'

export const strategy = {
  NULLS_SMALLEST: 'NULLS_SMALLEST',
  NULLS_LARGEST: 'NULLS_LARGEST',
  NULLS_ALWAYS_FIRST: 'NULLS_ALWAYS_FIRST',
  NULLS_ALWAYS_LAST: 'NULLS_ALWAYS_LAST',
} as const

type Properties = (string | [string, (typeof strategy)[keyof typeof strategy]])[]

// || behavior ||
// order[r.field] = 'asc' | 'desc' | {nulls: 'first' | 'last'} (the relation ordered is the main)
// order[r][field] = 'asc' | 'desc' | {nulls: 'first' | 'last'} (the relation ordered is r)
// order[r1.r2.field] = 'asc' | 'desc' | {nulls: 'first' | 'last'} (the relation ordered is main)
// order[r1.r2][field] = 'asc' | 'desc' | {nulls: 'first' | 'last'} (the relation ordered is r2)
// order[r1][r2.field] = 'asc' | 'desc' | {nulls: 'first' | 'last'} (the relation ordered is r1 by the r2.field)
// order[r1][r2][r3.field] = 'asc' | 'desc' | {nulls: 'first' | 'last'} (the relation ordered is r2 by the r3.field)
// order[r1][r2][field] = 'asc' | 'desc' | {nulls: 'first' | 'last'} (the relation ordered is r2 by the field)

// ! for the moment only the order inside nested relation is supprorted (you can't order by a relation for the main)
// ! the specific properties does not work

// ? to implements the properties, i have to make sure the relaiton are block by default and only the main properties
// ? are allowed by the properties
// ? when no properties are given, all the properties are allowed except the relation properties

// || allowedProperties behavior ||
// allowedProperties = ['id', 'file']
// allowedProperties = [['id', strategy(enmu).*], 'file']
// allowedProperties = ['relation.file']
// allowedProperties = ['relation.*']
// allowedProperties = ['relation.**']
// allowedProperties = ['*']
// allowedProperties = ['**']

// || strategy behavior ||
// NULLS_SMALLEST the nulls are the smallest in the order
// NULLS_LARGEST the nulls are the largest in the order
// NULLS_ALWAYS_FIRST the nulls always come first in the order
// NULLS_ALWAYS_LAST the nulls always come last in the order

export default function OrderFilter<T extends NormalizeConstructor<typeof CustomBaseModelFilter>> (
  _?: Properties
) {
  return function orderFilterMixin (Base: T) {
    return class SearchFilterMixin extends Base {
      public order (value: RecursiveValue): void {
        const relationArray = Object.entries(value).map(([key, value]) => {
          return {
            path: key.split('.'),
            relationPath: key.split('.').slice(0, -1),
            value: value,
            key: key.split('.').slice(-1)[0],
          }
        })

        relationArray.forEach((relation) => {
          if (!relationPathExists(this.$query.model, relation.relationPath)) {
            throw new Error(
              'The relation path (' +
                [this.$query.model.table, ...relation.path].join('.') +
                ') does not exist'
            )
          }
          // const stringPaths = relation.values.map((value) => relation.path.join('.') + '.' + value)
          // the properties can contain string | string.relation | string.* (for all properties of the relation) |
          // string.relation.** (for all properties of the relation and all nested relations)
          // i want to check if the stringPath is allowed by the properties
          // if (properties) {
          //   stringPaths.forEach((stringPath) => {
          //     const found = properties?.find((property) => {
          //       const regex = new RegExp(
          //         '^' +
          //           property
          //             .replace(/\./g, '\\.')
          //             .replace(/\*/g, '[^.]*')
          //             .replace(/\*\*/g, '.*')
          //             .replace(/\.(\*)/g, '\\.[^.]*')
          //             .replace(/\.(\*\*)/g, '\\..*') +
          //           '$'
          //       )
          //       return regex.test(stringPath)
          //     })
          //     if (!found) {
          //       throw new Error(
          //         'The relation path (' +
          //           [this.$query.model.table, ...relation.path].join('.') +
          //           ') does not exist in the properties'
          //       )
          //     }
          //   })
          // }
          // console.log(
          //   'before preload order : ' +
          //     relation.key +
          //     ' by ' +
          //     relation.value +
          //     ' from (' +
          //     [this.$query.model.table, ...relation.relationPath].join('.') +
          //     ') relation'
          // )
          // console.log(relation.value)
          preloadQuery(this.$loadedRelation, this.$query, relation.relationPath, (query) => {
            // console.log(
            //   'order : ' +
            //     relation.value +
            //     ' by ' +
            //     relation.key +
            //     ' from (' +
            //     [query.model.table, ...relation.relationPath].join('.') +
            //     ') relation'
            // )
            if (Array.isArray(relation.value)) {
              if (relation.value.length !== 1) {
                return
              }
              query.orderBy(relation.key, relation.value[0])
              return
            }
            query.orderBy(relation.key, relation.value)
            return
          })
        })
      }
    }
  }
}
