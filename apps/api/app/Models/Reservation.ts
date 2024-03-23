import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Spa from './Spa'
import AppBaseModel from './AppBaseModel'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import { compose } from '@ioc:Adonis/Core/Helpers'
import ReservationFilter from './Filters/ReservationFilter'

export default class Reservation extends compose(AppBaseModel, Filterable) {
  public static $filter = () => ReservationFilter

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

  @column.date()
  public startAt: DateTime

  @column.date()
  public endAt: DateTime
}
