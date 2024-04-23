import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Image from './Image'
import Video from './Video'
import HomeComment from './HomeComment'
import AppBaseModel from './AppBaseModel'

export default class Home extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public description: string

  @column()
  public imageId: number

  @belongsTo(() => Image)
  public image: BelongsTo<typeof Image>

  @column()
  public videoId: number

  @belongsTo(() => Video)
  public video: BelongsTo<typeof Video>

  @hasMany(() => HomeComment)
  public homeComments: HasMany<typeof HomeComment>
}
