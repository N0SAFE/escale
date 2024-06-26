import { DateTime } from 'luxon'
import {
  BelongsTo,
  ManyToMany,
  beforeFetch,
  beforeFind,
  belongsTo,
  column,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import Image from './Image'
import AppBaseModel from './AppBaseModel'

export default class Service extends AppBaseModel {
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

  @beforeFind()
  @beforeFetch()
  public static async preloadImage(query) {
    query.preload('image')
  }
}
