import { inject } from '@adonisjs/fold'
import Availability from 'App/Models/Availability'
import Reservation from 'App/Models/Reservation'
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'
import DateTimeService from './DateTimeService'
import ReservationNotChainingException from 'App/Exceptions/ReservationNotChainingException'
import AlreadyReservedException from 'App/Exceptions/AlreadyReservedException'

@inject()
export default class ReservationService {
  constructor (private dateTimeService: DateTimeService) {}

  public async getReservationsBetweenDate (
    startAt: DateTime,
    endAt: DateTime,
    spa?: Spa
  ): Promise<Reservation[]> {
    const reservationQueryBuilder = Reservation.query()
      .where('startAt', '<', endAt.toSQLDate()!)
      .where('endAt', '>', startAt.toSQLDate()!)
    if (spa) {
      return reservationQueryBuilder.where('spa_id', spa.id).exec()
    } else {
      return reservationQueryBuilder.exec()
    }
  }

  public async getAvailabilitiesBetweenDate (
    startAt: DateTime,
    endAt: DateTime,
    spa?: Spa
  ): Promise<Availability[]> {
    const availabilitiesQueryBuilder = Availability.query()
      .where('start_at', '<=', endAt.toSQL()!)
      .andWhere('end_at', '>=', startAt.toSQL()!)
    if (!spa) {
      return await availabilitiesQueryBuilder.exec()
    } else {
      return await availabilitiesQueryBuilder.andWhere('spa_id', spa.id).exec()
    }
  }

  private getFirst<T> (items: T[]): T | undefined {
    return items?.[0]
  }

  public async datesIsAvailable (
    startAt: DateTime,
    endAt: DateTime,
    spa: Spa
  ): Promise<Availability[]> {
    const availability = await this.getAvailabilitiesBetweenDate(startAt, endAt, spa)

    const reservation = this.getFirst(await this.getReservationsBetweenDate(startAt, endAt, spa))

    // check if all the availibilty have all the day
    const isAvailabilityChaining =
      availability.reduce((acc, availability) => {
        const availabilityStartAt = availability.startAt
        const availabilitySndAt = availability.endAt
        const intersectionDuration = this.dateTimeService.getIntersectionBetweenDates(
          startAt,
          endAt,
          availabilityStartAt,
          availabilitySndAt
        )
        return acc + intersectionDuration
      }, 0) >= this.dateTimeService.getNumberOfDaysBetweenDates(startAt, endAt)

    if (!isAvailabilityChaining) {
      throw new ReservationNotChainingException()
    }

    // check if the spa is available
    if (reservation) {
      throw new AlreadyReservedException()
    }

    return availability
  }

  // this calculate the price of a reservation on a given startDate and endDate
  // if the endDate is the same as the startDate, it will calculate the price for a night
  // if the endDate is the day after the startDate, it will calculate the price for a night also
  // else it will calculate the price for a diff between the endDate and the startDate in days minus 1
  public async calculatePrice (spa: Spa, startAt: DateTime, endAt: DateTime) {
    const availabilities = await this.datesIsAvailable(startAt, endAt, spa)

    if (endAt.diff(startAt, 'days').days >= 1) {
      endAt = endAt.minus({ days: 1 })
    }

    return availabilities.reduce(
      (acc, availability) => {
        const availabilityStartAt = availability.startAt
        const availabilityEndAt = availability.endAt
        const intersectionDuration = Math.min(
          endAt.diff(availabilityStartAt, 'days').days + 1,
          availabilityEndAt.diff(startAt, 'days').days + 1,
          availabilityEndAt.diff(availabilityStartAt, 'days').days + 1,
          endAt.diff(startAt, 'days').days + 1
        )
        const details = acc.details
        if (details.toPrice.has(availability.nightPrice)) {
          details.toPrice.set(
            availability.nightPrice,
            details.toPrice.get(availability.nightPrice)! + intersectionDuration
          )
        } else {
          details.toPrice.set(availability.nightPrice, intersectionDuration)
        }
        return {
          price: acc.price + intersectionDuration * availability.nightPrice,
          details: details,
          // TODO: change to price per day of per afternoon
        }
      },
      {
        price: 0,
        details: {
          toPrice: new Map(),
        },
      }
    )
  }
}
