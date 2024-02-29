import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuid } from 'uuid';

export default class File extends BaseModel {
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

  @computed()
  public get path () {
    return `${this.uuid}.${this.extname}`
  }

  @column()
  public size: number

  @beforeCreate()
  public static createUuid (file: File) {
    file.uuid = uuid()
  }
}
