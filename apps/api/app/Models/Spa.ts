import { DateTime } from 'luxon'
import {
  HasMany,
  ManyToMany,
  beforeFetch,
  beforeFind,
  column,
  hasMany,
  hasOne,
  manyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import Availability from './Availability'
import Tag from './Tag'
import Service from './Service'
import Reservation from './Reservation'
import SpaImage from './SpaImage'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import SpaFilter from './Filters/SpaFilter'
import AppBaseModel from './AppBaseModel'
import { HasOne } from '@ioc:Adonis/Lucid/Orm'
import InternalCalendar from './InternalCalendar'
import ExternalCalendar from './ExternalCalendar'
import Unavailability from './Unavailability'
import Comment from './Comment'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'

export default class Spa extends compose(AppBaseModel, Filterable, SoftDeletes) {
  public static $filter = () => SpaFilter

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

  @hasMany(() => SpaImage)
  public spaImages: HasMany<typeof SpaImage>

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  // @manyToMany(() => Image, {
  //   pivotTable: 'image_spa',
  //   pivotColumns: ['order'],
  //   pivotTimestamps: true,
  //   onQuery: (query) => {
  //     query.orderBy('order', 'asc')
  //   },
  // })
  // public images: ManyToMany<typeof Image>

  @hasMany(() => Reservation)
  public reservations: HasMany<typeof Reservation>

  @hasMany(() => Availability)
  public availability: HasMany<typeof Availability> // ! change to availabilities

  @hasMany(() => Tag)
  public tags: HasMany<typeof Tag>

  @manyToMany(() => Service, {
    pivotTable: 'spa_services',
  })
  public services: ManyToMany<typeof Service>

  @column()
  public location: string

  @column()
  public googleMapsLink: string

  @hasMany(() => Unavailability)
  public unavailabilities: HasMany<typeof Unavailability>

  @hasOne(() => ExternalCalendar)
  public externalCalendar: HasOne<typeof ExternalCalendar>

  @hasOne(() => InternalCalendar)
  public internalCalendar: HasOne<typeof InternalCalendar>

  @beforeFind()
  @beforeFetch()
  public static async preloadImages(query) {
    query.preload('spaImages')
  }
}
