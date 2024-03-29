import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ReservationRessourcePostDto } from './dto/ReservationDto/Post'
import Reservation from 'App/Models/Reservation'
import { ReservationRessourceGetCollectionDto } from './dto/ReservationDto/GetCollection'
import { inject } from '@adonisjs/core/build/standalone'
import ReservationService from 'App/Service/ReservationService'
import { ReservationsRessourceAvailableDatesDto } from './dto/ReservationDto/AvailableDates'
import { ReservationRessourcePriceDto } from './dto/ReservationDto/Price'

@inject()
export default class ReservationsController {
  constructor (protected reservationService: ReservationService) {}

  public async index ({ request, response }: HttpContextContract) {
    const dto = ReservationRessourceGetCollectionDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform

    const { page, limit, ...rest } = query

    const reservationQuery = Reservation.filter(rest)

    if (page || limit) {
      await reservationQuery.paginate(page || 1, limit || 10)
    }

    reservationQuery.orderBy('start_at', 'asc')

    return response.ok(await reservationQuery.exec())
  }

  public async create ({}: HttpContextContract) {}

  public async store ({ request, response }: HttpContextContract) {
    const dto = ReservationRessourcePostDto.fromRequest(request)
    console.log(dto)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = await dto.after.customTransform

    const exist = await Reservation.query()
      .where('start_at', '<=', body.endAt.toSQLDate()!)
      .andWhere('end_at', '>=', body.startAt.toSQLDate()!)
      .first()
      .then((reservation) => !!reservation)

    if (exist) {
      return response.badRequest({ message: 'reservation already exist' })
    }

    const reservation = await Reservation.create({
      startAt: body.startAt,
      endAt: body.endAt,
      spaId: body.spa.id,
    })

    return response.ok(reservation)
  }

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}

  public async availableDates ({ request, response }: HttpContextContract) {
    const dto = new ReservationsRessourceAvailableDatesDto({
      body: request.body(),
      query: request.qs(),
    })

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform

    const availabilities = await this.reservationService.getAvailabilitiesBetweenDate(
      query.startAt,
      query.endAt,
      query.spa
    )

    const reservations = await this.reservationService.getReservationsBetweenDate(
      query.startAt,
      query.endAt,
      query.spa
    )

    console.log(reservations)

    const numberOfDays = query.endAt.diff(query.startAt, 'days').days + 1
    return Array.from({ length: numberOfDays }, (_, i) => {
      const date = query.startAt.plus({ days: i })
      const isBooked = !!reservations.find((reservation) => {
        return date >= reservation.startAt && date < reservation.endAt
      })

      const isAvailable = !!availabilities.find((availability) => {
        // check if the date is between the start and end of the availability
        return date >= availability.startAt && date <= availability.endAt
      })

      return {
        date: date.toISODate(),
        available: !isBooked && isAvailable,
      }
    })
  }

  public async price ({ request, response }: HttpContextContract) {
    console.log('validate request')
    const dto = ReservationRessourcePriceDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }
    console.log('no error in the request')

    const { query } = await dto.after.customTransform

    console.log('calculate price')

    const { price, details } = await this.reservationService.calculatePrice(
      query.spa,
      query.startAt,
      query.endAt
    )

    console.log('price is : ' + price)

    return response.ok({
      price,
      details: {
        toPrice: Array.from(details.toPrice.entries()).map(([price, number]) => ({
          price,
          number,
        })),
      },
    })
  }
}
