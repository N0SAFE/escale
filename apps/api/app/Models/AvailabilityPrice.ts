import { DateTime } from 'luxon'
import AppBaseModel from './AppBaseModel'
import { column } from '@ioc:Adonis/Lucid/Orm'

export default class AvailabilityPrice extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public day: number

  @column()
  public night: number

  @column()
  public journey: number
}
