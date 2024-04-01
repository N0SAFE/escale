import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import AirbnbCalendarEvent from './AirbnbCalendarEvent'
import BookingCalendarEvent from './BookingCalendarEvent'

export default class ExternalCalendar extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Spa)
  public spa: HasOne<typeof Spa>

  @column()
  public spaId: number

  @hasMany(() => AirbnbCalendarEvent)
  public airbnbEvents: HasMany<typeof AirbnbCalendarEvent>

  @hasMany(() => BookingCalendarEvent)
  public bookingEvents: HasMany<typeof BookingCalendarEvent>

  @column()
  public airbnbCalendarUrl: string

  @column()
  public bookingCalendarUrl: string
}
