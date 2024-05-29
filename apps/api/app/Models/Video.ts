import { DateTime } from 'luxon'
import { beforeFetch, beforeFind, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import VideoSource from './VideoSource'
import { compose } from '@ioc:Adonis/Core/Helpers'
import AppBaseModel from './AppBaseModel'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import VideoFilter from './Filters/VideoFilter'

export default class Video extends compose(AppBaseModel, Filterable) {
  public static $filter = () => VideoFilter

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public alt: string

  @hasMany(() => VideoSource)
  public sources: HasMany<typeof VideoSource>

  @computed()
  public get paths() {
    if (!this.sources) {
      return undefined
    }
    return this.sources.map((source) => {
      return `${source.directory}/${source.file.uuid}.${source.file.extname}`
    })
  }

  @computed()
  public get serverFileNames() {
    if (!this.sources) {
      return undefined
    }
    return this.sources.map((source) => {
      return `${source.file.uuid}.${source.file.extname}`
    })
  }

  @beforeFind()
  @beforeFetch()
  public static async preloadFile(query) {
    query.preloadChain('sources')
  }
}
