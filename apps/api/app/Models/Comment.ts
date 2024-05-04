import { DateTime } from 'luxon'
import { BelongsTo, beforeFetch, beforeFind, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
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
  public userId: number | null = null

  @column()
  public spaId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Spa)
  public spa: BelongsTo<typeof Spa>

  @beforeFind()
  @beforeFetch()
  public static async fetchComments (query) {
    query.preload('user')
  }
}
