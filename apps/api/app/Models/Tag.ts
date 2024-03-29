import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import AppBaseModel from './AppBaseModel'

export default class Tag extends AppBaseModel {
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
  public label: string

  @column()
  public icon: string

  @column()
  public number: number
}
