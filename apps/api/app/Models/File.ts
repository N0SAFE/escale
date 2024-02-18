import { DateTime } from 'luxon'
import { BaseModel, afterDelete, column, computed } from '@ioc:Adonis/Lucid/Orm'
import fs from 'fs'
import Application from '@ioc:Adonis/Core/Application'

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
  public name: string

  @computed()
  public get path () {
    return `/tmp/uploads/${this.uuid}`
  }

  @column()
  public size: number
}
