import { DateTime } from 'luxon'
import { BelongsTo, beforeFetch, beforeFind, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import AvailabilityFilter from './Filters/AvailabilityFilter'
import AppBaseModel from './AppBaseModel'
import AvailabilityPrice from './AvailabilityPrice'

export default class Availability extends compose(AppBaseModel, Filterable) {
  public static $filter = () => AvailabilityFilter

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.date()
  public startAt: DateTime

  @column.date()
  public endAt: DateTime

  @column()
  public spaId: number

  @belongsTo(() => Spa)
  public spa: BelongsTo<typeof Spa>

  @belongsTo(() => AvailabilityPrice, {
    foreignKey: 'monPriceId',
  })
  public monPrice: BelongsTo<typeof AvailabilityPrice>

  @belongsTo(() => AvailabilityPrice, {
    foreignKey: 'tuePriceId',
  })
  public tuePrice: BelongsTo<typeof AvailabilityPrice>

  @belongsTo(() => AvailabilityPrice, {
    foreignKey: 'wedPriceId',
  })
  public wedPrice: BelongsTo<typeof AvailabilityPrice>

  @belongsTo(() => AvailabilityPrice, {
    foreignKey: 'thuPriceId',
  })
  public thuPrice: BelongsTo<typeof AvailabilityPrice>

  @belongsTo(() => AvailabilityPrice, {
    foreignKey: 'friPriceId',
  })
  public friPrice: BelongsTo<typeof AvailabilityPrice>

  @belongsTo(() => AvailabilityPrice, {
    foreignKey: 'satPriceId',
  })
  public satPrice: BelongsTo<typeof AvailabilityPrice>

  @belongsTo(() => AvailabilityPrice, {
    foreignKey: 'sunPriceId',
  })
  public sunPrice: BelongsTo<typeof AvailabilityPrice>

  @column()
  public monPriceId: number

  @column()
  public tuePriceId: number

  @column()
  public wedPriceId: number

  @column()
  public thuPriceId: number

  @column()
  public friPriceId: number

  @column()
  public satPriceId: number

  @column()
  public sunPriceId: number

  @beforeFind()
  @beforeFetch()
  public static async fetchPrice (query) {
    query.preload('monPrice')
    query.preload('tuePrice')
    query.preload('wedPrice')
    query.preload('thuPrice')
    query.preload('friPrice')
    query.preload('satPrice')
    query.preload('sunPrice')
  }
}
