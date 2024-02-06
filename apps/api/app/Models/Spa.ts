import { DateTime } from 'luxon'
import { BaseModel, HasMany, ManyToMany, column, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Availability from './Availability'
import Tag from './Tag'
import Service from './Service'

export default class Spa extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public title: string

  @column()
  public description: string

  @column({
    prepare: (value: string[]) => JSON.stringify(value),
  })
  public images: string[]

  @hasMany(() => Availability)
  public availability: HasMany<typeof Availability>

  @hasMany(() => Tag)
  public tags: HasMany<typeof Tag>

  @manyToMany(() => Service, {
    pivotTable: 'spa_services',
  })
  public services: ManyToMany<typeof Service>
}
