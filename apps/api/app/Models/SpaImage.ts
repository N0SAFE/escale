import { DateTime } from 'luxon'
import { BelongsTo, beforeFetch, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import Image from './Image'
import AppBaseModel from './AppBaseModel'

export default class SpaImage extends AppBaseModel {
  public static table = 'spa_image'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public spaId: number

  @belongsTo(() => Spa)
  public spa: BelongsTo<typeof Spa>

  @column()
  public imageId: number | null = null

  @belongsTo(() => Image)
  public image: BelongsTo<typeof Image>

  @column()
  public order: number

  @beforeFetch()
  public static async preloadImage(query) {
    query.orderBy('order', 'asc').preload('image')
  }
}
