import type { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { CustomBaseModelFilter } from './CustomBaseModelFilter'

export const strategy = {
  EXCLUDE_NULL: 'EXCLUDE_NULL',
  INCLUDE_NULL_BEFORE: 'INCLUDE_NULL_BEFORE',
  INCLUDE_NULL_AFTER: 'INCLUDE_NULL_AFTER',
  INCLUDE_NULL_BEFORE_AND_AFTER: 'INCLUDE_NULL_BEFORE_AND_AFTER',
} as const

type Properties = (string | [string, (typeof strategy)[keyof typeof strategy]])[]

export default function DatesFilter<T extends NormalizeConstructor<typeof CustomBaseModelFilter>> (
  properties?: Properties
) {
  return function datesFilterMixin (Base: T) {
    return class DatesFilterMixin extends Base {
      constructor (...args: any[]) {
        super(...args)
        const [query, input] = args as [
          ModelQueryBuilderContract<LucidModel, any>,
          Record<
            string,
            {
              after?: string
              before?: string
              strictly_after?: string
              strictly_before?: string
            }
          >
        ]
        const model = query.model
        Object.entries(input).forEach(([key, value]) => {
          if (!model.$columnsDefinitions.get(key)?.columnName) {
            return
          }
          const property = properties?.find((property) => {
            if (Array.isArray(property)) {
              return (
                model.$columnsDefinitions.get(property[0])?.columnName ===
                model.$columnsDefinitions.get(key)?.columnName
              )
            } else {
              return (
                model.$columnsDefinitions.get(property)?.columnName ===
                model.$columnsDefinitions.get(key)?.columnName
              )
            }
          })
          if (!properties ? true : property) {
            // ! implement the strategy here to handle the null values here
          } else {
            // it means that the property is not in the properties array
            return
          }
          if (value?.after || value?.before || value?.strictly_after || value?.strictly_before) {
            const columnName = model.$columnsDefinitions.get(key)?.columnName!
            if (value.strictly_before) {
              query.where(columnName, '<', value.strictly_before)
            }
            if (value.before) {
              query.where(columnName, '<=', value.before)
            }
            if (value.strictly_after) {
              query.where(columnName, '>', value.strictly_after)
            }
            if (value.after) {
              query.where(columnName, '>=', value.after)
            }
          }
        })
      }
    }
  }
}
