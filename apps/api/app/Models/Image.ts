import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
  computed,
} from '@ioc:Adonis/Lucid/Orm'
import File from './File'

export default class Image extends BaseModel {
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
  public get path () {
    if (!this.file) {
      return null
    }
    return `${this.directory}/${this.serverFileName}`
  }

  @computed()
  public get directory () {
    return 'images'
  }

  @computed()
  public get serverFileName () {
    if (!this.file) {
      return null
    }
    return `${this.file.uuid}.${this.file.extname}`
  }

  @beforeFind()
  @beforeFetch()
  public static async preloadFile (query) {
    query.preload('file')
  }
}
