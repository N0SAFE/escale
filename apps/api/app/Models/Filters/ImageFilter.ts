import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Image from 'App/Models/Image'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { CustomBaseModelFilter } from './mixins/CustomBaseModelFilter'
import groupsFilterMixin from './mixins/groups'
import PropertiesFilter from './mixins/properties'
import OrderFilter from './mixins/orders'
import SearchFilter from './mixins/search'

export default class ImageFilter extends compose(
  CustomBaseModelFilter,
  groupsFilterMixin,
  PropertiesFilter(['id', 'file']),
  SearchFilter(),
  OrderFilter()
) {
  public $query: ModelQueryBuilderContract<typeof Image, Image>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
}
