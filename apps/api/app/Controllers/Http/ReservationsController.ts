import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ReservationsRessourcePostDto } from './dto/ReservationsDto/Post'
import Reservation from 'App/Models/Reservation'
import { DateTime } from 'luxon'
import { ReservationsRessourceGetCollectionDto } from './dto/ReservationsDto/GetCollection'
import { inject } from '@adonisjs/core/build/standalone'
import ReservationService from 'App/Service/ReservationService'
import { ReservationsRessourceAvailableDatesDto } from './dto/ReservationsDto/AvailableDates'
import BookedDate from 'App/Models/BookedDate'
import { ReservationsRessourcePriceDto } from './dto/ReservationsDto/Price'
import { ReservationsRessourceJourneyPriceDto } from './dto/ReservationsDto/JourneyPrice'

@inject()
export default class ReservationsController {
  constructor (protected reservationService: ReservationService) {}

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

    // const reservation = await Reservation.create({
    //   startAt: DateTime.fromISO(body.startAt),
    //   endAt: DateTime.fromISO(body.endAt),
    // })

    // return response.ok(reservation)
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

    if (query.type === 'night') {
      const bookedDates = await BookedDate.query()
        .join('reservations', function (builder) {
          builder
            .on('reservations.id', 'booked_dates.reservation_id')
            .andOnIn('reservations.spa_id', [String(query.spa.id)])
        })
        .where('type', 'night')
        .orWhere('type', 'journey')
        .andWhere('date', '>=', query.startAt.toSQLDate()!)
        .andWhere('date', '<=', query.endAt.toSQLDate()!)
        .exec()
      // console.log(bookedDates)
      // create an array of day between start and end
      const numberOfDays = query.endAt.diff(query.startAt, 'days').days + 1
      return Array.from({ length: numberOfDays }, (_, i) => {
        const date = query.startAt.plus({ days: i })
        const isBooked = !!bookedDates.find((bookedDate) => {
          return bookedDate.date.hasSame(date, 'day')
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
    } else if (query.type === 'day') {
      const bookedDates = await BookedDate.query()
        .join('reservations', function (builder) {
          builder
            .on('reservations.id', 'booked_dates.reservation_id')
            .andOnIn('reservations.spa_id', [String(query.spa.id)])
        })
        .where('type', 'day')
        .orWhere('type', 'journey')
        .andWhere('date', '>=', query.startAt.toSQLDate()!)
        .andWhere('date', '<=', query.endAt.toSQLDate()!)
        .exec()
      // create an array of day between start and end
      const numberOfDays = query.endAt.diff(query.startAt, 'days').days + 1
      return Array.from({ length: numberOfDays }, (_, i) => {
        const date = query.startAt.plus({ days: i })
        const isBooked = !!bookedDates.find((bookedDate) => {
          return bookedDate.date.hasSame(date, 'day')
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
    } else if (query.type === 'journey') {
      const bookedDates = await BookedDate.query()
        .join('reservations', function (builder) {
          builder
            .on('reservations.id', 'booked_dates.reservation_id')
            .andOnIn('reservations.spa_id', [String(query.spa.id)])
        })
        .where('type', 'journey')
        .orWhere('type', 'day')
        .orWhere('type', 'night')
        .andWhere('date', '>=', query.startAt.toSQLDate()!)
        .andWhere('date', '<=', query.endAt.toSQLDate()!)
        .exec()
      // create an array of day between start and end
      const numberOfDays = query.endAt.diff(query.startAt, 'days').days + 1
      return Array.from({ length: numberOfDays }, (_, i) => {
        const date = query.startAt.plus({ days: i })
        const isBooked = !!bookedDates.find((bookedDate) => {
          return bookedDate.date.hasSame(date, 'day')
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
  }

  public async price ({ request, response }: HttpContextContract) {
    const dto = new ReservationsRessourcePriceDto({
      body: request.body(),
      query: request.qs(),
    })

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform

    const availability = await this.reservationService.getAvailabilitieByDate(query.date, query.spa)

    if (!availability) {
      return response.badRequest({ message: 'this day is not available' })
    }

    return response.ok({
      price: query.type === 'night' ? availability.nightPrice : availability.dayPrice,
    })
  }

  public async journeyPrice ({ request, response }: HttpContextContract) {
    const dto = new ReservationsRessourceJourneyPriceDto({
      body: request.body(),
      query: request.qs(),
    })

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform

    const res = await this.reservationService.datesIsAvailable(
      query.startAt,
      query.endAt,
      query.spa
    )

    if (!res.state) {
      return response.badRequest({ message: res.message })
    }

    const availabilities = res.availability

    const price = availabilities.reduce((acc, availability) => {
      const startAt = query.startAt
      const endAt = query.endAt
      const availabilityStartAt = availability.startAt
      const availabilityEndAt = availability.endAt
      const intersectionDuration = Math.min(
        endAt.diff(availabilityStartAt, 'days').days + 1,
        availabilityEndAt.diff(startAt, 'days').days + 1
      )
      return acc + intersectionDuration * availability.journeyPrice
    }, 0)

    return response.ok({ price })
  }
}
