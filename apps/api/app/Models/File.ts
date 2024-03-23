import { DateTime } from 'luxon'
import { beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid'
import AppBaseModel from './AppBaseModel'

export default class File extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public extname: string

  @column()
  public name: string

  @column()
  public size: number

  @beforeCreate()
  public static createUuid (file: File) {
    file.uuid = uuid()
  }
}
