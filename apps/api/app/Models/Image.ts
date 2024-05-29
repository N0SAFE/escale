import { DateTime } from 'luxon'
import {
  BelongsTo,
  afterDelete,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import File from './File'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { compose } from '@ioc:Adonis/Core/Helpers'
import ImageFilter from './Filters/ImageFilter'
import AppBaseModel from './AppBaseModel'
import Drive from '@ioc:Adonis/Core/Drive'

export default class Image extends compose(AppBaseModel, Filterable) {
  public static $filter = () => ImageFilter

  @column()
  public image_id: number

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public alt: string

  @column()
  public fileId: number

  @belongsTo(() => File)
  public file: BelongsTo<typeof File>

  @computed()
  public get path() {
    if (!this.file) {
      return undefined
    }
    return `${this.directory}/${this.serverFileName}`
  }

  @computed()
  public get directory() {
    return 'images'
  }

  @computed()
  public get serverFileName() {
    if (!this.file) {
      return undefined
    }
    return `${this.file.uuid}.${this.file.extname}`
  }

  @beforeFind()
  @beforeFetch()
  public static async preloadFile(query) {
    query.preloadChain('file')
  }

  @afterDelete()
  public static async deleteFile(image: Image) {
    if (image.file) {
      await image.file.delete()
    }
    await Drive.delete(image.directory + '/' + image.serverFileName)
  }
}
