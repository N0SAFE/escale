import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, ManyToMany, beforeFetch, belongsTo, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import Image from './Image'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Spa, {
    pivotTable: 'spa_services',
  })
  public spa: ManyToMany<typeof Spa>

  @column()
  public label: string

  @column()
  public description: string

  @column()
  public imageId: number | null = null

  @belongsTo(() => Image)
  public image: BelongsTo<typeof Image>

  @beforeFetch()
  public static async preloadImage (query) {
    query.preload('image')
  }
}
