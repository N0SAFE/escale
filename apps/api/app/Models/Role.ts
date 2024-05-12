import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public label: string

  @column()
  public description: string

  @column()
  public isAdmin: boolean

  @column()
  public isDefault: boolean

  @column()
  public isActive: boolean

  @column.dateTime()
  public deletedAt: DateTime

  @manyToMany(() => User)
  public users: ManyToMany<typeof User>
}
