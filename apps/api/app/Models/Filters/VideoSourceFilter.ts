import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import VideoSource from 'App/Models/VideoSource'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { CustomBaseModelFilter } from './mixins/CustomBaseModelFilter'
import SearchFilter from './mixins/search'

export default class VideoSourceFilter extends compose(CustomBaseModelFilter, SearchFilter()) {
  public $query: ModelQueryBuilderContract<typeof VideoSource, VideoSource>

  // public method (value: any): void {
  //   this.$query.where('name', value)
  // }
}
