import { DateTime } from 'luxon'
import {
  afterDelete,
  beforeFetch,
  beforeFind,
  BelongsTo,
  belongsTo,
  column,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import Video from './Video'
import { compose } from '@ioc:Adonis/Core/Helpers'
import AppBaseModel from './AppBaseModel'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import VideoSourceFilter from './Filters/VideoSourceFilter'
import Drive from '@ioc:Adonis/Core/Drive'

export default class VideoSource extends compose(AppBaseModel, Filterable) {
  public static $filter = () => VideoSourceFilter

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public fileId: number

  @belongsTo(() => File)
  public file: BelongsTo<typeof File>

  @column()
  public videoId: number

  @belongsTo(() => Video)
  public video: BelongsTo<typeof Video>

  @computed()
  public get path () {
    if (!this.file) {
      return undefined
    }
    return `${this.directory}/${this.serverFileName}`
  }

  @computed()
  public get directory () {
    return 'videoSources'
  }

  @computed()
  public get serverFileName () {
    if (!this.file) {
      return undefined
    }
    return `${this.file.uuid}.${this.file.extname}`
  }

  @beforeFind()
  @beforeFetch()
  public static async preloadFile (query) {
    query.preloadChain('file')
  }

  @afterDelete()
  public static async deleteFile (source: VideoSource) {
    if (source.file) {
      await source.file.delete()
    }
    await Drive.delete(source.directory + '/' + source.serverFileName)
  }
}
