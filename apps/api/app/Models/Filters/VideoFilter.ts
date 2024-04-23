import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import Video from 'App/Models/Video'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { CustomBaseModelFilter } from './mixins/CustomBaseModelFilter'
import SearchFilter from './mixins/search'

export default class VideoFilter extends compose(CustomBaseModelFilter, SearchFilter([])) {
  public $query: ModelQueryBuilderContract<typeof Video, Video>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
}
