import { DateTime } from 'luxon'
import { BaseModel, HasOne, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Reservation from './Reservation'

export default class NightReservation extends BaseModel {
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
  public date: DateTime

  @hasOne(() => Reservation)
  public reservation: HasOne<typeof Reservation>
}
