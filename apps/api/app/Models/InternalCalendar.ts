import { DateTime } from 'luxon'
import { beforeCreate, beforeDelete, column, computed, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import { v4 as uuid } from 'uuid'
import Drive from '@ioc:Adonis/Core/Drive'
import AppBaseModel from './AppBaseModel'

export default class InternalCalendar extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get directory () {
    return 'calendars'
  }

  @computed()
  public get path () {
    return `${this.directory}/${this.uuid}.ics`
  }

  @column()
  public uuid: string

  @hasOne(() => Spa)
  public spa: HasOne<typeof Spa>

  @column()
  public spaId: number

  @beforeCreate()
  public static generateUuid (internalCalendar: InternalCalendar) {
    internalCalendar.uuid = uuid()
  }

  @beforeDelete()
  public static async deleteCalendar (internalCalendar: InternalCalendar) {
    try {
      await Drive.delete(internalCalendar.path)
    } catch {}
  }
}
