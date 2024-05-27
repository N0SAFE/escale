import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ExternalCalendar from './ExternalCalendar'
import AppBaseModel from './AppBaseModel'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { compose } from '@ioc:Adonis/Core/Helpers'
import ExternalCalendarEventFilter from './Filters/ExternalCalendarEventFilter'

export default class ExternalCalendarEvent extends compose(AppBaseModel, Filterable) {
  public static $filter = () => ExternalCalendarEventFilter

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
  public from: 'airbnb' | 'booking'

  @column()
  public type: 'blocked' | 'reserved'

  @column.date()
  public startAt: DateTime

  @column.date()
  public endAt: DateTime
}
