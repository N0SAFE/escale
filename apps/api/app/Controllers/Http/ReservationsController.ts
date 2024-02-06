import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ReservationsRessourcePostDto } from './dto/ReservationsDto/Post'
import Reservation from 'App/Models/Reservation'
import { DateTime } from 'luxon'
import { ReservationsRessourceGetCollectionDto } from './dto/ReservationsDto/GetCollection'

export default class ReservationsController {
  public async index ({ request, response }: HttpContextContract) {
    const dto = new ReservationsRessourceGetCollectionDto({
      body: request.body(),
      query: request.qs(),
    })

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = dto

    const reservationQuery = Reservation.query()

    if (query.startAt) {
      reservationQuery.where('start_at', '>=', DateTime.fromISO(query.startAt).toSQLDate()!)
    }

    if (query.endAt) {
      reservationQuery.where('end_at', '<=', DateTime.fromISO(query.endAt).toSQLDate()!)
    }

    if (query.page || query.limit) {
      reservationQuery.paginate(query.page || 1, query.limit || 10)
    }

    const reservations = await reservationQuery.exec()

    return response.ok(reservations)
  }

  public async create ({}: HttpContextContract) {}

  public async store ({ request, response }: HttpContextContract) {
    const dto = new ReservationsRessourcePostDto({ body: request.body(), query: request.qs() })
    console.log(dto)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = dto

    const exist = await Reservation.query()
      .where('start_at', '<=', DateTime.fromISO(body.endAt).toSQLDate()!)
      .andWhere('end_at', '>=', DateTime.fromISO(body.startAt).toSQLDate()!)
      .first()
      .then((reservation) => !!reservation)

    if (exist) {
      return response.badRequest({ message: 'reservation already exist' })
    }

    const reservation = await Reservation.create({
      startAt: DateTime.fromISO(body.startAt),
      endAt: DateTime.fromISO(body.endAt),
    })

    return response.ok(reservation)
  }

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
