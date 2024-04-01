import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Unavailability from 'App/Models/Unavailability'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { CustomBaseModelFilter } from './mixins/CustomBaseModelFilter'
import SearchFilter from './mixins/search'
import PropertiesFilter from './mixins/properties'
import DatesFilter from './mixins/dates'
import OrderFilter from './mixins/orders'
import groupsFilterMixin from './mixins/groups'

export default class UnavailabilityFilter extends compose(
  CustomBaseModelFilter,
  groupsFilterMixin,
  PropertiesFilter(),
  DatesFilter(['startAt', 'endAt']),
  SearchFilter([]),
  OrderFilter()
) {
  public $query: ModelQueryBuilderContract<typeof Unavailability, Unavailability>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
}
