import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AvailabilityRessourcePostDto } from './dto/AvailabilityDto/Post'
import Availability from 'App/Models/Availability'
import { AvailabilityRessourceGetCollectionDto } from './dto/AvailabilityDto/GetCollection'
import { AvailabilityRessourcePatchDto } from './dto/AvailabilityDto/Patch'
import AvailabilityPrice from 'App/Models/AvailabilityPrice'
import { AvailabilityRessourceDeleteDto } from './dto/AvailabilityDto/Delete'
import { inject } from '@adonisjs/core/build/standalone'

@inject()
export default class AvailabilitiesController {
  public async index({ response, request }: HttpContextContract) {
    const dto = AvailabilityRessourceGetCollectionDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform

    const { page, limit, ...rest } = query

    const availabilityQuery = Availability.filter(rest)

    if (page || limit) {
      await availabilityQuery.paginate(page || 1, limit || 10)
    }

    availabilityQuery.orderBy('start_at', 'asc')

    // const availabilityQuery = Availability.query().preload('spa', (spaQuery) => {
    //   spaQuery.preload('tags')
    // }).preload('spa', (spaQuery) => {
    //   spaQuery.select('id')
    // })

    return response.ok(await availabilityQuery.exec())

    // const availabilityQuery = Availability.query()

    // if (query?.startAt) {
    //   availabilityQuery.where('start_at', '>=', query.startAt.toSQLDate()!)
    // }

    // if (query?.endAt) {
    //   availabilityQuery.where('end_at', '<=', query.endAt.toSQLDate()!)
    // }

    // if (query?.page || query?.limit) {
    //   availabilityQuery.paginate(query?.page || 1, query?.limit || 10)
    // }

    // const reservations = await availabilityQuery.exec()

    // return response.ok(reservations)
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    const dto = AvailabilityRessourcePostDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = await dto.after.customTransform

    const availability = await Availability.create({
      startAt: body.startAt,
      endAt: body.endAt,
      spaId: body.spaId,
    })

    const daysPrice = [
      {
        name: 'mon',
        price: body.monPrice,
      },
      {
        name: 'tue',
        price: body.tuePrice,
      },
      {
        name: 'wed',
        price: body.wedPrice,
      },
      {
        name: 'thu',
        price: body.thuPrice,
      },
      {
        name: 'fri',
        price: body.friPrice,
      },
      {
        name: 'sat',
        price: body.satPrice,
      },
      {
        name: 'sun',
        price: body.sunPrice,
      },
    ]

    const priceMap = new Map<string, AvailabilityPrice>()
    const daysMap = new Map<string, AvailabilityPrice>()

    for (const { name, price } of daysPrice) {
      if (price) {
        if (priceMap.has(JSON.stringify(price))) {
          daysMap.set(name, priceMap.get(JSON.stringify(price))!)
        } else {
          const availabilityPrice = await AvailabilityPrice.create({
            day: price.day,
            night: price.night,
            journey: price.journey,
          })
          daysMap.set(name, availabilityPrice)
          priceMap.set(JSON.stringify(price), availabilityPrice)
        }
      }
    }

    await Promise.all(
      Array.from(daysMap).map(async function ([key, value]) {
        await availability
          .related(
            (key + 'Price') as `${['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][number]}Price`
          )
          .associate(value)
      })
    )

    return response.created(availability)
  }

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({ request, response }: HttpContextContract) {
    const dto = AvailabilityRessourcePatchDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body, params } = await dto.after.customTransform

    const availability = params.id

    const prices = Array.from(
      new Set([
        availability.monPriceId,
        availability.tuePriceId,
        availability.wedPriceId,
        availability.thuPriceId,
        availability.friPriceId,
        availability.satPriceId,
        availability.sunPriceId,
      ])
    )

    const daysPrice = [
      {
        name: 'mon',
        price: body.monPrice,
      },
      {
        name: 'tue',
        price: body.tuePrice,
      },
      {
        name: 'wed',
        price: body.wedPrice,
      },
      {
        name: 'thu',
        price: body.thuPrice,
      },
      {
        name: 'fri',
        price: body.friPrice,
      },
      {
        name: 'sat',
        price: body.satPrice,
      },
      {
        name: 'sun',
        price: body.sunPrice,
      },
    ]

    const priceMap = new Map<string, AvailabilityPrice>()
    const daysMap = new Map<string, AvailabilityPrice>()

    for (const { name, price } of daysPrice) {
      if (price) {
        if (priceMap.has(JSON.stringify(price))) {
          daysMap.set(name, priceMap.get(JSON.stringify(price))!)
        } else {
          const availabilityPrice = await AvailabilityPrice.create({
            day: price.day,
            night: price.night,
            journey: price.journey,
          })
          daysMap.set(name, availabilityPrice)
          priceMap.set(JSON.stringify(price), availabilityPrice)
        }
      }
    }

    availability.merge({
      startAt: body.startAt,
      endAt: body.endAt,
      spaId: body.spaId,
      monPriceId: daysMap.get('mon')?.id,
      tuePriceId: daysMap.get('tue')?.id,
      wedPriceId: daysMap.get('wed')?.id,
      thuPriceId: daysMap.get('thu')?.id,
      friPriceId: daysMap.get('fri')?.id,
      satPriceId: daysMap.get('sat')?.id,
      sunPriceId: daysMap.get('sun')?.id,
    })

    await availability.save()

    const pricesToDelete = await AvailabilityPrice.findMany(prices)
    await Promise.all(
      pricesToDelete.map(async (price) => {
        await price.delete()
      })
    )

    return response.ok(availability)
  }

  public async destroy({ request, response }: HttpContextContract) {
    const dto = AvailabilityRessourceDeleteDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform

    const availability = await params.id
    await availability.delete()

    return response.ok({
      message: 'Availability deleted',
    })
  }
}
