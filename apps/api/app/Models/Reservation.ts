import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Spa from './Spa'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public email?: string

  @column()
  public spaId: number

  @column()
  public userId: number

  @belongsTo(() => Spa)
  public spa: BelongsTo<typeof Spa>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column.dateTime({
    consume: (value: Date) => DateTime.fromISO(value.toISOString()),
    prepare: (value: DateTime) => value.toISODate(),
  })
  public startAt: DateTime

  @column.dateTime({
    consume: (value: Date) => DateTime.fromISO(value.toISOString()),
    prepare: (value: DateTime) => value.toISODate(),
  })
  public endAt: DateTime
}
