import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Spa from './Spa'
import DayReservation from './DayReservation'
import NightReservation from './NightReservation'
import JourneyReservation from './JourneyReservation'

export default class Reservation extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasOne(() => Spa)
  public spa: HasOne<typeof Spa>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public email?: string

  @belongsTo(() => DayReservation)
  public dayReservation: BelongsTo<typeof DayReservation>

  @belongsTo(() => NightReservation)
  public nightReservation: BelongsTo<typeof NightReservation>

  @belongsTo(() => JourneyReservation)
  public journeyReservation: BelongsTo<typeof JourneyReservation>
}
