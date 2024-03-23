import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Availability from 'App/Models/Availability'
import { compose } from '@ioc:Adonis/Core/Helpers'
import DatesFilter from './mixins/dates'
import groupsFilterMixin from './mixins/groups'
import SearchFilter from './mixins/search'
import OrderFilter from './mixins/orders'
import { CustomBaseModelFilter } from './mixins/CustomBaseModelFilter'
import PropertiesFilter from './mixins/properties'

export default class AvailabilityFilter extends compose(
  CustomBaseModelFilter,
  groupsFilterMixin,
  PropertiesFilter(),
  DatesFilter(['startAt', 'endAt']),
  SearchFilter([]),
  OrderFilter()
) {
  public $setupPromise: Promise<void>
  public $query: ModelQueryBuilderContract<typeof Availability, Availability>
  public $input: {
    groups?: string[]
  }

  // public startAt (value: DateTime): void {
  //   this.$query.where('start_at', '>=', value.toSQLDate()!)
  // }

  // public endAt (value: DateTime): void {
  //   this.$query.where('end_at', '<=', value.toSQLDate()!)
  // }

  public id (value: number): void {
    this.$query.where('id', value)
  }

  public ids (value: number[]) {
    this.$query.whereIn('id', value)
  }

  public spa (value: number) {
    this.$query.where('spa_id', value)
  }

  public spas (value: number[]): void {
    this.$query.whereIn('spa_id', value)
  }

  // public property (value: string[]): void {
  //   this.$query.select(value)
  // }

  // public groups(value: string[]): void {
  //   console.log('groups')
  //   const map = new Map<string, string[]>()
  //   value.forEach((group) => {
  //     const [from, to] = group.split(':')
  //     if (map.has(from)) {
  //       map.get(from)?.push(to)
  //     } else {
  //       map.set(from, [to])
  //     }
  //   })
  //   const relationCreated = new Set<`${string}:${string}`>()
  //   const rec = (
  //     parentTable: string,
  //     field: string,
  //     relationQuery: RelationQueryBuilderContract<LucidModel, any>
  //   ) => {
  //     const tableName = relationQuery.model.table
  //     if (relationCreated.has(`${parentTable}:${field}`)) {
  //       throw new Exception(`the relation as already been preloaded
  // for the relation ${parentTable}:${field}`, 500, 'E_PRELOAD_ALREADY_DONE')
  //     }
  //     relationCreated.add(`${parentTable}:${field}`)
  //     const fields = map.get(tableName)

  //     if (fields) {
  //       fields.forEach((field) => {
  //         relationQuery.preload(field as any, (queryRelation) => {
  //           rec(tableName, field, queryRelation)
  //         })
  //       })
  //     }
  //   }
  //   const parentTableName = this.$query.model.table
  //   const fields = map.get(parentTableName)
  //   if (fields) {
  //     fields.forEach((field) => {
  //       this.$query.preload(field as any, (queryRelation) => {
  //         rec(parentTableName, field, queryRelation)
  //       })
  //     })
  //   }
  // }

  // public count (value: boolean): void {
  //   console.log(value)
  //   if (value) {
  //     this.$query.count('*')
  //   }
  // }

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
}
