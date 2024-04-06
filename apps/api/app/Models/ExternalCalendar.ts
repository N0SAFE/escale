import { DateTime } from 'luxon'
import { column, HasMany, hasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import ExternalCalendarEvent from './ExternalCalendarEvent'
import AppBaseModel from './AppBaseModel'

export default class ExternalCalendar extends AppBaseModel {
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

  @hasMany(() => ExternalCalendarEvent)
  public airbnbEvents: HasMany<typeof ExternalCalendarEvent>

  @hasMany(() => ExternalCalendarEvent)
  public bookingEvents: HasMany<typeof ExternalCalendarEvent>

  @column()
  public airbnbCalendarUrl: string

  @column()
  public bookingCalendarUrl: string
}
