import { DateTime } from 'luxon'
import { column } from '@ioc:Adonis/Lucid/Orm'
import AppBaseModel from './AppBaseModel'

export default class Contact extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public email: string

  @column()
  public message: string

  @column()
  public subject: string

  @column()
  public name: string

  @column()
  public read: boolean
}
