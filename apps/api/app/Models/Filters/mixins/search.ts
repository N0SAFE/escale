import type { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
import { Relation, preloadQuery, relationPathExists } from './utils'
import { CustomBaseModelFilter } from './CustomBaseModelFilter'
import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export const strategy = {
  PARTIAL: 'PARTIAL',
  START: 'START',
  END: 'END',
  EXACT: 'EXACT',
  IPARTIAL: 'IPARTIAL',
  ISTART: 'ISTART',
  IEND: 'IEND',
  IEXACT: 'IEXACT',
  NULL: 'NULL',
} as const

type Properties = string | [string, (typeof strategy)[keyof typeof strategy]]

function searchProperty(
  properties: Properties[] | undefined,
  key: string,
  query: ModelQueryBuilderContract<LucidModel>
) {
  return properties?.find((property) => {
    if (Array.isArray(property)) {
      return (
        (query.model.$columnsDefinitions.get(property[0])?.columnName ===
          query.model.$columnsDefinitions.get(key)?.columnName) !==
        undefined
      )
    } else {
      return (
        (query.model.$columnsDefinitions.get(property)?.columnName ===
          query.model.$columnsDefinitions.get(key)?.columnName) !==
        undefined
      )
    }
  })
}

// searchFilter is actually broken and will work when fixed and after find how to apply nested logic to the main
export default function SearchFilter<T extends NormalizeConstructor<typeof CustomBaseModelFilter>>(
  properties?: Properties[]
) {
  return function searchFilterMixin(Base: T) {
    return class SearchFilterMixin extends Base {
      public $loadedRelation: Relation
      constructor(...args: any[]) {
        super(...args)

        this.addAfter((query, input) => {
          const model = query.model
          Object.entries(input).forEach(([path, value]) => {
            if (
              !relationPathExists(
                model,
                path.split('.').slice(0, -1)!,
                path.split('.').slice(-1).join()!
              )
            ) {
              return
            }
            if (typeof value !== 'string') {
              return
            }
            const relationPath = path.split('.').slice(0, -1)
            const key = path.split('.').slice(-1)[0]

            preloadQuery(this.$loadedRelation, query, relationPath, (query) => {
              const property = searchProperty(properties, key, query)
              const columnName = query.model.$columnsDefinitions.get(key)?.columnName!
              if (!properties) {
                query.where(columnName, 'like', `${value}`)
                return
              }
              if (property) {
                if (Array.isArray(property)) {
                  switch (property[1]) {
                    case strategy.PARTIAL:
                      query.where(columnName, 'like', `%${value}%`)
                      break
                    case strategy.START:
                      query.where(columnName, 'like', `${value}%`)
                      break
                    case strategy.END:
                      query.where(columnName, 'like', `%${value}`)
                      break
                    case strategy.EXACT:
                      query.where(columnName, value)
                      break
                    case strategy.IPARTIAL:
                      query.where(columnName, 'ilike', `%${value}%`)
                      break
                    case strategy.ISTART:
                      query.where(columnName, 'ilike', `${value}%`)
                      break
                    case strategy.IEND:
                      query.where(columnName, 'ilike', `%${value}`)
                      break
                    case strategy.IEXACT:
                      query.where(columnName, 'ilike', value)
                      break
                    case strategy.NULL:
                      query.where(columnName, 'like', value)
                      break
                  }
                } else {
                  query.where(columnName, 'like', `${value}`)
                }
              }
            })
          })
        })
      }
    }
  }
}
