import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { AvailabilityRessourcePostDto } from './dto/AvailabilityDto/Post'
import Availability from 'App/Models/Availability'
import { AvailabilityRessourceGetCollectionDto } from './dto/AvailabilityDto/GetCollection'

export default class AvailabilitiesController {
  public async index ({ response, request }: HttpContextContract) {
    const dto = AvailabilityRessourceGetCollectionDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform

    const availabilityQuery = Availability.query()

    if (query?.startAt) {
      availabilityQuery.where('start_at', '>=', query.startAt.toSQLDate()!)
    }

    if (query?.endAt) {
      availabilityQuery.where('end_at', '<=', query.endAt.toSQLDate()!)
    }

    if (query?.page || query?.limit) {
      availabilityQuery.paginate(query?.page || 1, query?.limit || 10)
    }

    const reservations = await availabilityQuery.exec()

    return response.ok(reservations)
  }

  public async create ({}: HttpContextContract) {}

  public async store ({ request, response }: HttpContextContract) {
    const dto = new AvailabilityRessourcePostDto({ body: request.body(), query: request.qs() })

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = await dto.after.customTransform

    const exist = await Availability.query()
      .where('start_at', '<=', body.endAt.toISODate()!)
      .andWhere('end_at', '>=', body.startAt.toISODate()!)
      .andWhere('spa_id', body.spa.id)
      .first()
      .then((reservation) => !!reservation)

    if (exist) {
      return response.badRequest({
        message: 'this period overlap to another period that has already been configured',
      })
    }

    const reservation = await Availability.create(body, { allowExtraProperties: true })
    await reservation.related('spa').associate(body.spa)
    await reservation.load('spa')

    return response.ok(reservation)
  }

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
