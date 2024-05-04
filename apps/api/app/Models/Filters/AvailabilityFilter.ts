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
}
