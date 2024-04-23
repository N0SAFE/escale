import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Comment from './Comment'
import Home from './Home'
import AppBaseModel from './AppBaseModel'

export default class HomeComment extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public commentId: number

  @belongsTo(() => Comment)
  public comment: BelongsTo<typeof Comment>

  @column()
  public homeId: number

  @belongsTo(() => Home)
  public home: BelongsTo<typeof Home>
}
