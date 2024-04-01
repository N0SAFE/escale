import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { compose } from '@ioc:Adonis/Core/Helpers'
import UnavailabilityFilter from './Filters/UnavailabilityFilter'
import AppBaseModel from './AppBaseModel'

export default class Unavailability extends compose(AppBaseModel, Filterable) {
  public static $filter = () => UnavailabilityFilter

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.date()
  public startAt: DateTime

  @column.date()
  public endAt: DateTime

  @column()
  public spaId: number

  @belongsTo(() => Spa)
  public spa: BelongsTo<typeof Spa>
}
