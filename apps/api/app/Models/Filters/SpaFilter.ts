import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Spas from 'App/Models/Spa'
import groupsFilterMixin from './mixins/groups'
import { CustomBaseModelFilter } from './mixins/CustomBaseModelFilter'
import PropertiesFilter from './mixins/properties'
import SearchFilter from './mixins/search'
import OrderFilter from './mixins/orders'
import { compose } from '@ioc:Adonis/Core/Helpers'

export default class SpaFilter extends compose(
  CustomBaseModelFilter,
  groupsFilterMixin,
  PropertiesFilter(['id', 'file']),
  SearchFilter(),
  OrderFilter()
) {
  public $query: ModelQueryBuilderContract<typeof Spas, Spas>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
}
