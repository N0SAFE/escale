import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ReservationRessourcePostDto } from './dto/ReservationDto/Post'
import Reservation from 'App/Models/Reservation'
import { ReservationRessourceGetCollectionDto } from './dto/ReservationDto/GetCollection'
import { inject } from '@adonisjs/core/build/standalone'
import ReservationService from 'App/Service/ReservationService'
import { ReservationsRessourceAvailableDatesDto } from './dto/ReservationDto/AvailableDates'
import { ReservationRessourcePriceDto } from './dto/ReservationDto/Price'
import { ReservationRessourceGetDto } from './dto/ReservationDto/Get'
import { ReservationRessourcePatchDto } from './dto/ReservationDto/Patch'
import { ReservationRessourceDeleteDto } from './dto/ReservationDto/Delete'
import { ReservationRessourceUnreservableDto } from './dto/ReservationDto/Unreservable'
import ExternalCalendarEvent from 'App/Models/ExternalCalendarEvent'
import { ReservationRessourceClosestUnreservableDto } from './dto/ReservationDto/ClosestUnreservable'
import AvailabilityService from 'App/Service/AvailabilityService'
import { ReservationRessourceReservableDto } from './dto/ReservationDto/Reservable'
import { DateTime } from 'luxon'

@inject()
export default class ReservationsController {
  constructor (
    protected reservationService: ReservationService,
    protected availabilityService: AvailabilityService
  ) {}

  public async index ({ request, response }: HttpContextContract) {
    const dto = ReservationRessourceGetCollectionDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform

    const { page, limit, ...rest } = query

    console.log(rest)

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
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = await dto.after.customTransform

    const exist = await Reservation.query()
      .where('start_at', '<', body.endAt.toSQLDate()!)
      .andWhere('end_at', '>', body.startAt.toSQLDate()!)
      .first()
    // .then((reservation) => !!reservation)

    if (exist) {
      return response.badRequest({ message: 'reservation already exist' })
    }

    const reservation = await Reservation.create({
      startAt: body.startAt,
      endAt: body.endAt,
      spaId: body.spaId,
      notes: body.notes,
    })

    return response.ok(reservation)
  }

  public async show ({ request, response }: HttpContextContract) {
    const dto = ReservationRessourceGetDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform
    return response.ok(params.id)
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({ request, response }: HttpContextContract) {
    const dto = ReservationRessourcePatchDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params, body } = await dto.after.customTransform
    const reservation = params.id

    const reservations = Reservation.query()
      .where('start_at', '<', body.endAt.toSQLDate()!)
      .andWhere('end_at', '>', body.startAt.toSQLDate()!)
      .whereNot('id', reservation.id)

    if (await reservations.first()) {
      return response.badRequest({ message: 'reservation overlap' })
    }

    console.log(body.notes)

    reservation.merge({
      startAt: body.startAt,
      endAt: body.endAt,
      notes: body.notes,
      spaId: body.spaId,
    })

    await reservation.save()

    return response.ok(reservation)
  }

  public async destroy ({ request, response }: HttpContextContract) {
    const dto = ReservationRessourceDeleteDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform

    const reservation = params.id
    await reservation.delete()

    return response.ok({ message: 'Reservation deleted' })
  }

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
    const dto = ReservationRessourcePriceDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform

    const { price, details } = await this.reservationService.calculatePrice(
      query.spa,
      query.startAt,
      query.endAt
    )

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

  public async getReservableDates ({ request, response }: HttpContextContract) {
    const dto = ReservationRessourceReservableDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform
    const {
      from,
      to,
      spa,
      includeExternalBlockedCalendarEvents,
      includeExternalReservedCalendarEvents,
      includeAvailabilities,
      includeReservations,
      avoidReservationIds,
    } = query

    return response.ok(
      await this.availabilityService.getAvailableDates(spa, from, to, {
        includeExternalBlockedCalendarEvents,
        includeExternalReservedCalendarEvents,
        includeAvailabilities,
        includeReservations,
        avoidReservationIds,
      })
    )
  }

  public async getUnreservable ({ request, response }: HttpContextContract) {
    const dto = ReservationRessourceUnreservableDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform
    const {
      from,
      to,
      spa,
      includeUnavailabilities,
      includeExternalBlockedCalendarEvents,
      includeExternalReservedCalendarEvents,
    } = query

    const externalCalendar = await spa.related('externalCalendar').query().first()
    const reservations = await spa
      .related('reservations')
      .query()
      .where('end_at', '>=', from.toSQLDate()!)
      .where('start_at', '<=', to.toSQLDate()!)
      .exec()

    if (!externalCalendar) {
      return response.ok({
        reservations,
        airbnbEvents: [],
        bookingEvents: [],
      })
    }

    let blockedEvents

    if (includeExternalBlockedCalendarEvents) {
      blockedEvents = await ExternalCalendarEvent.query()
        .where('external_calendar_id', externalCalendar.id)
        .where('type', 'blocked')
        .where('end_at', '>=', from.toSQLDate()!)
        .where('start_at', '<=', to.toSQLDate()!)
        .orderBy('start_at', 'asc')
        .exec()
    }

    let reservedEvents

    if (includeExternalReservedCalendarEvents) {
      reservedEvents = await ExternalCalendarEvent.query()
        .where('external_calendar_id', externalCalendar.id)
        .where('type', 'reserved')
        .where('end_at', '>=', from.toSQLDate()!)
        .where('start_at', '<=', to.toSQLDate()!)
        .orderBy('start_at', 'asc')
        .exec()
    }

    let unavailabilities

    if (includeUnavailabilities) {
      const firstAvailability = await spa
        .related('availability')
        .query()
        .orderBy('start_at', 'asc')
        .first()

      const lastAvailability = await spa
        .related('availability')
        .query()
        .orderBy('end_at', 'desc')
        .first()

      unavailabilities = {
        availabilityPastLimit: firstAvailability?.startAt?.toISODate(),
        data: await spa
          .related('unavailabilities')
          .query()
          .where('end_at', '>=', from.toSQLDate()!)
          .where('start_at', '<=', to.toSQLDate()!)
          .orderBy('start_at', 'asc')
          .exec(),
        availabilityFutureLimit: lastAvailability?.endAt?.toISODate(),
      }
    }

    return response.ok({
      reservations,
      reservedEvents,
      blockedEvents,
      unavailabilities,
    })
  }

  public async getClosestUnreservableDates ({ request, response }: HttpContextContract) {
    const dto = ReservationRessourceClosestUnreservableDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform

    const {
      date,
      spa,
      includeUnavailabilities,
      includeExternalBlockedCalendarEvents,
      includeExternalReservedCalendarEvents,
      avoidIds,
    } = query

    await spa.load('externalCalendar')

    const pastReservation = await spa
      .related('reservations')
      .query()
      .where('end_at', '<=', date.toSQLDate()!)
      .whereNotIn('id', avoidIds)
      .orderBy('end_at', 'desc')
      .first()
    const futureReservation = await spa
      .related('reservations')
      .query()
      .where('start_at', '>=', date.toSQLDate()!)
      .whereNotIn('id', avoidIds)
      .orderBy('start_at', 'asc')
      .first()

    let pastUnavailability
    let futureUnavailability
    let pastLimit
    let futureLimit

    if (includeUnavailabilities) {
      const firstAvailability = await spa
        .related('availability')
        .query()
        .orderBy('start_at', 'asc')
        .first()
      const lastAvailability = await spa
        .related('availability')
        .query()
        .orderBy('end_at', 'desc')
        .first()
      pastLimit = firstAvailability?.startAt
      futureLimit = lastAvailability?.endAt
      pastUnavailability = await spa
        .related('unavailabilities')
        .query()
        .where('end_at', '<=', date.toSQLDate()!)
        .orderBy('end_at', 'desc')
        .first()
      futureUnavailability = await spa
        .related('unavailabilities')
        .query()
        .where('start_at', '>=', date.toSQLDate()!)
        .orderBy('start_at', 'asc')
        .first()
    }

    let pastExternalBlockedEvent
    let futureExternalBlockedEvent

    if (includeExternalBlockedCalendarEvents && spa.externalCalendar?.id) {
      pastExternalBlockedEvent = await ExternalCalendarEvent.query()
        .where('external_calendar_id', spa.externalCalendar.id)
        .where('type', 'blocked')
        .where('end_at', '<=', date.toSQLDate()!)
        .orderBy('end_at', 'desc')
        .first()
      futureExternalBlockedEvent = await ExternalCalendarEvent.query()
        .where('external_calendar_id', spa.externalCalendar.id)
        .where('type', 'blocked')
        .where('start_at', '>=', date.toSQLDate()!)
        .orderBy('start_at', 'asc')
        .first()
    }

    let pastExternalReservedEvent
    let futureExternalReservedEvent

    if (includeExternalReservedCalendarEvents && spa.externalCalendar?.id) {
      pastExternalReservedEvent = await ExternalCalendarEvent.query()
        .where('external_calendar_id', spa.externalCalendar.id)
        .where('type', 'reserved')
        .where('end_at', '<=', date.toSQLDate()!)
        .orderBy('end_at', 'desc')
        .first()
      futureExternalReservedEvent = await ExternalCalendarEvent.query()
        .where('external_calendar_id', spa.externalCalendar.id)
        .where('type', 'reserved')
        .where('start_at', '>=', date.toSQLDate()!)
        .orderBy('start_at', 'asc')
        .first()
    }

    function getClosestDate (...dates: (DateTime | undefined)[]) {
      return dates.reduce<DateTime | undefined>((prev, current) => {
        if (!prev) {
          return current
        }
        if (!current) {
          return prev
        }
        return Math.abs(date.diff(prev).milliseconds) < Math.abs(date.diff(current).milliseconds)
          ? prev
          : current
      }, undefined)
    }

    return {
      past: getClosestDate(
        pastReservation?.endAt,
        pastUnavailability?.endAt,
        pastExternalBlockedEvent?.endAt,
        pastExternalReservedEvent?.endAt,
        pastLimit
      )?.toISODate(),
      future: getClosestDate(
        futureReservation?.startAt,
        futureUnavailability?.startAt,
        futureExternalBlockedEvent?.startAt,
        futureExternalReservedEvent?.startAt,
        futureLimit
      )?.toISODate(),
    }
  }
}
