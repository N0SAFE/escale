import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Reservation from 'App/Models/Reservation'
import { CustomBaseModelFilter } from './mixins/CustomBaseModelFilter'
import groupsFilterMixin from './mixins/groups'
import PropertiesFilter from './mixins/properties'
import DatesFilter from './mixins/dates'
import SearchFilter from './mixins/search'
import OrderFilter from './mixins/orders'
import { compose } from '@ioc:Adonis/Core/Helpers'

export default class ReservationFilter extends compose(
  CustomBaseModelFilter,
  groupsFilterMixin,
  PropertiesFilter(),
  DatesFilter(['startAt', 'endAt']),
  SearchFilter([]),
  OrderFilter()
) {
  public $setupPromise: Promise<void>
  public $query: ModelQueryBuilderContract<typeof Reservation, Reservation>

  public notInIds (ids: number[]): void {
    this.$query.whereNotIn('id', ids)
  }

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
}
