import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Reservation from './Reservation'

export default class JourneyReservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

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

  @hasOne(() => Reservation)
  public reservation: HasOne<typeof Reservation>
}
