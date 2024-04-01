import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ExternalCalendar from './ExternalCalendar'

export default class BookingCalendarEvent extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => ExternalCalendar)
  public externalCalendar: BelongsTo<typeof ExternalCalendar>

  @column()
  public externalCalendarId: number

  @column()
  public type: 'blocked' | 'reserved'

  @column.date()
  public startAt: DateTime

  @column.date()
  public endAt: DateTime
}
