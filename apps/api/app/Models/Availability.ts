import { DateTime } from 'luxon'
import {
  BelongsTo,
  beforeDelete,
  beforeFetch,
  beforeFind,
  beforeUpdate,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import AvailabilityFilter from './Filters/AvailabilityFilter'
import AppBaseModel from './AppBaseModel'
import AvailabilityPrice from './AvailabilityPrice'
import AvaialbilityRepository from './Repositories/Availability'
import { beforeCreate } from '@ioc:Adonis/Lucid/Orm'
import Unavailability from './Unavailability'

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
    query
      .preload('monPrice')
      .preload('tuePrice')
      .preload('wedPrice')
      .preload('thuPrice')
      .preload('friPrice')
      .preload('satPrice')
      .preload('sunPrice')
  }

  @beforeCreate()
  public static async changeUnavailabilities (availability: Availability) {
    const availabilityRepository = new AvaialbilityRepository()
    const date = availability.startAt.toSQLDate()!
    // get the unavailability where the date is between the start and end
    const unavailability = await Unavailability.query()
      .where('startAt', '<=', date)
      .where('endAt', '>=', date)
      .where('spaId', availability.spaId)
      .first()

    if (unavailability) {
      await unavailability.delete()
    }
    const previousAvailability = await availabilityRepository.getClosestAvailabilityBefore(
      availability.startAt.toSQLDate()!,
      availability.spaId
    )
    const nextAvailability = await availabilityRepository.getClosestAvailabilityAfter(
      availability.endAt.toSQLDate()!,
      availability.spaId
    )
    if (previousAvailability) {
      if (previousAvailability.endAt.plus({ days: 1 }) !== availability.startAt) {
        const startAt = previousAvailability.endAt.plus({ days: 1 })
        const endAt = availability.startAt.minus({ days: 1 })
        if (startAt <= endAt) {
          const newUnavailability = new Unavailability()
          newUnavailability.startAt = startAt
          newUnavailability.endAt = endAt
          newUnavailability.spaId = availability.spaId
          await newUnavailability.save()
        }
      }
    }
    if (nextAvailability) {
      if (availability.endAt.plus({ days: 1 }) !== nextAvailability.startAt) {
        const startAt = availability.endAt.plus({ days: 1 })
        const endAt = nextAvailability.startAt.minus({ days: 1 })
        if (startAt <= endAt) {
          const newUnavailability = new Unavailability()
          newUnavailability.startAt = startAt
          newUnavailability.endAt = endAt
          newUnavailability.spaId = availability.spaId
          await newUnavailability.save()
        }
      }
    }
  }

  @beforeDelete()
  public static async changeUnavailabilitiesOnDelete (availability: Availability) {
    const availabilityRepository = new AvaialbilityRepository()
    const previousAvailability = await availabilityRepository.getClosestAvailabilityBefore(
      availability.startAt.toSQLDate()!,
      availability.spaId
    )
    const nextAvailability = await availabilityRepository.getClosestAvailabilityAfter(
      availability.endAt.toSQLDate()!,
      availability.spaId
    )

    if (previousAvailability && nextAvailability) {
      const unavailabilities = await Unavailability.query()
        .where('startAt', '>=', previousAvailability?.endAt.toSQLDate()!)
        .where('endAt', '<=', nextAvailability?.startAt.toSQLDate()!)
        .where('spaId', availability.spaId)
        .exec()

      for (const unavailability of unavailabilities) {
        await unavailability.delete()
      }

      const newUnavailability = new Unavailability()
      newUnavailability.startAt = previousAvailability.endAt.plus({ days: 1 })
      newUnavailability.endAt = nextAvailability.startAt.minus({ days: 1 })
      newUnavailability.spaId = availability.spaId
      await newUnavailability.save()
    } else if (nextAvailability) {
      const unavailabilities = await Unavailability.query()
        .where('startAt', '<=', nextAvailability.startAt.toSQLDate()!)
        .where('endAt', '>=', availability.endAt.toSQLDate()!)
        .where('spaId', availability.spaId)
        .exec()

      for (const unavailability of unavailabilities) {
        await unavailability.delete()
      }

      const newUnavailability = new Unavailability()
      newUnavailability.startAt = availability.endAt.plus({ days: 1 })
      newUnavailability.endAt = nextAvailability.startAt.minus({ days: 1 })
      newUnavailability.spaId = availability.spaId
      await newUnavailability.save()
    } else if (previousAvailability) {
      const unavailabilities = await Unavailability.query()
        .where('startAt', '<=', availability.startAt.toSQLDate()!)
        .where('endAt', '>=', previousAvailability.endAt.toSQLDate()!)
        .where('spaId', availability.spaId)
        .exec()

      for (const unavailability of unavailabilities) {
        await unavailability.delete()
      }

      const newUnavailability = new Unavailability()
      newUnavailability.startAt = previousAvailability.endAt.plus({ days: 1 })
      newUnavailability.endAt = availability.startAt.minus({ days: 1 })
      newUnavailability.spaId = availability.spaId
      await newUnavailability.save()
    }
  }

  @beforeUpdate()
  public static async changeUnavailabilitiesOnUpdate (availability: Availability) {
    const availabilityRepository = new AvaialbilityRepository()
    const previousAvailability = await availabilityRepository.getClosestAvailabilityBefore(
      availability.startAt.toSQLDate()!,
      availability.spaId
    )
    const nextAvailability = await availabilityRepository.getClosestAvailabilityAfter(
      availability.endAt.toSQLDate()!,
      availability.spaId
    )

    if (previousAvailability && nextAvailability) {
      const unavailabilities = await Unavailability.query()
        .where('startAt', '>=', previousAvailability?.endAt.toSQLDate()!)
        .where('endAt', '<=', nextAvailability?.startAt.toSQLDate()!)
        .where('spaId', availability.spaId)
        .exec()

      for (const unavailability of unavailabilities) {
        await unavailability.delete()
      }

      const newBeforeUnavailability = new Unavailability()
      newBeforeUnavailability.startAt = previousAvailability.endAt.plus({ days: 1 })
      newBeforeUnavailability.endAt = availability.startAt.minus({ days: 1 })
      newBeforeUnavailability.spaId = availability.spaId
      await newBeforeUnavailability.save()

      const newAfterUnavailability = new Unavailability()
      newAfterUnavailability.startAt = availability.endAt.plus({ days: 1 })
      newAfterUnavailability.endAt = nextAvailability.startAt.minus({ days: 1 })
      newAfterUnavailability.spaId = availability.spaId
      await newAfterUnavailability.save()
    } else if (nextAvailability) {
      const unavailabilities = await Unavailability.query()
        .where('startAt', '<=', nextAvailability.startAt.toSQLDate()!)
        .where('endAt', '>=', availability.endAt.toSQLDate()!)
        .where('spaId', availability.spaId)
        .exec()

      for (const unavailability of unavailabilities) {
        await unavailability.delete()
      }

      const newAfterUnavailability = new Unavailability()
      newAfterUnavailability.startAt = availability.endAt.plus({ days: 1 })
      newAfterUnavailability.endAt = nextAvailability.startAt.minus({ days: 1 })
      newAfterUnavailability.spaId = availability.spaId
      await newAfterUnavailability.save()
    } else if (previousAvailability) {
      const unavailabilities = await Unavailability.query()
        .where('startAt', '<=', availability.startAt.toSQLDate()!)
        .where('endAt', '>=', previousAvailability.endAt.toSQLDate()!)
        .where('spaId', availability.spaId)
        .exec()

      for (const unavailability of unavailabilities) {
        await unavailability.delete()
      }

      const newBeforeUnavailability = new Unavailability()
      newBeforeUnavailability.startAt = previousAvailability.endAt.plus({ days: 1 })
      newBeforeUnavailability.endAt = availability.startAt.minus({ days: 1 })
      newBeforeUnavailability.spaId = availability.spaId
      await newBeforeUnavailability.save()
    }
  }
}
