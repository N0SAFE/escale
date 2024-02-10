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

  @hasOne(() => DayReservation)
  public dayReservation: HasOne<typeof DayReservation>

  @hasOne(() => NightReservation)
  public nightReservation: HasOne<typeof NightReservation>

  @hasOne(() => JourneyReservation)
  public journeyReservation: HasOne<typeof JourneyReservation>
}
