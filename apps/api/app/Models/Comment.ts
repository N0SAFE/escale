import { DateTime } from 'luxon'
import { BelongsTo, HasOne, belongsTo, column, hasOne } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Spa from './Spa'
import AppBaseModel from './AppBaseModel'

export default class Comment extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public text: string

  @column()
  public userId: number

  @column()
  public spaId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @hasOne(() => Spa)
  public spa: HasOne<typeof Spa>
}
