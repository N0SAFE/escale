import type { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
import {
  RecursiveValue,
  Relation,
  nestedRelationToArray,
  preloadQuery,
  relationPathExists,
} from './utils'
import { CustomBaseModelFilter } from './CustomBaseModelFilter'

type Properties = string[]

// || behavior ||
// property[] = field
// property[relation] = field

// ! for the moment all properties are allowed and the relation also
// ! the specific allowedProperties does not work so you can't use it

// ? to implements the allowedProperties, i have to make sure the relation are block by default and only the --
// ? main properties are allowed by the properties
// ? when no allowedProperties are given, all the properties are allowed except the relation properties

// || allowedProperties behavior ||
// allowedProperties = ['id', 'file']
// allowedProperties = ['relation.file']
// allowedProperties = ['relation.*']
// allowedProperties = ['relation.**']
// allowedProperties = ['*']
// allowedProperties = ['**']

export default function PropertiesFilter<
  T extends NormalizeConstructor<typeof CustomBaseModelFilter>
> (allowedProperties?: Properties) {
  allowedProperties
  return function propertiesFilterMixin (Base: T) {
    return class SearchFilterMixin extends Base {
      public $loadedRelation: Relation
      constructor (...args: any[]) {
        super(...args)
      }

      public property (value: RecursiveValue): void {
        console.log(value)
        const relationArray = nestedRelationToArray(value, this.$query)

        console.log(relationArray)

        relationArray.forEach((relation) => {
          if (!relationPathExists(this.$query.model, relation.relationPath)) {
            throw new Error(
              'The relation path (' +
                [this.$query.model.table, ...relation.relationPath].join('.') +
                ') does not exist'
            )
          }
          // const stringPaths = relation.values.map((value) => relation.path.join('.') + '.' + value)
          // the properties can contain string | string.relation | string.* (for all properties of the relation)
          // | string.relation.** (for all properties of the relation and all nested relations)
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
          preloadQuery(this.$loadedRelation, this.$query, relation.relationPath, (query) => {
            console.log(
              'select :' +
                relation.values +
                ' from (' +
                [this.$query.model.table, ...relation.relationPath].join('.') +
                ') relation'
            )
            console.log(query.model.table)
            query.select(relation.values)
          })
        })
      }
    }
  }
}
