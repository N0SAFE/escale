import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'

export default class Availability extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime({
    consume: (value: Date | undefined) => value && DateTime.fromISO(value.toISOString()),
    prepare: (value: DateTime) => value?.toISODate(),
  })
  public startAt: DateTime

  @column.dateTime({
    consume: (value: Date | undefined) => value && DateTime.fromISO(value.toISOString()),
    prepare: (value: DateTime) => value?.toISODate(),
  })
  public endAt: DateTime

  @column()
  public spaId: number

  @belongsTo(() => Spa)
  public spa: BelongsTo<typeof Spa>

  @column()
  public dayPrice: number

  @column()
  public nightPrice: number

  @column()
  public journeyPrice: number
}
