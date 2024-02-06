import { inject } from '@adonisjs/fold'
import Availability from 'App/Models/Availability'
import Reservation from 'App/Models/Reservation'
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'
import DateTimeService from './DateTimeService'

@inject()
export default class ReservationService {
  constructor (private dateTimeService: DateTimeService) {}

  public async getReservations (
    startAt: DateTime,
    endAt: DateTime,
    spa?: Spa
  ): Promise<Reservation[]> {
    if (!spa) {
      return await Reservation.query()
        .where('start_at', '<=', endAt.toSQL()!)
        .andWhere('end_at', '>=', startAt.toSQL()!)
        .exec()
    } else {
      return await Reservation.query()
        .where('start_at', '<=', endAt.toSQL()!)
        .andWhere('end_at', '>=', startAt.toSQL()!)
        .andWhere('spa_id', spa.id)
        .exec()
    }
  }

  public async getReservationByDay (date: DateTime, spa?: Spa): Promise<Reservation | null> {
    if (!spa) {
      return await Reservation.query()
        .where('start_at', '<=', date.toSQL()!)
        .andWhere('end_at', '>=', date.toSQL()!)
        .first()
    } else {
      return await Reservation.query()
        .where('start_at', '<=', date.toSQL()!)
        .andWhere('end_at', '>=', date.toSQL()!)
        .andWhere('spa_id', spa.id)
        .first()
    }
  }

  public async getAvailabilities (
    startAt: DateTime,
    endAt: DateTime,
    spa?: Spa
  ): Promise<Availability[]> {
    if (!spa) {
      return await Availability.query()
        .where('start_at', '<=', endAt.toSQL()!)
        .andWhere('end_at', '>=', startAt.toSQL()!)
        .exec()
    } else {
      return await Availability.query()
        .where('start_at', '<=', endAt.toSQL()!)
        .andWhere('end_at', '>=', startAt.toSQL()!)
        .andWhere('spa_id', spa.id)
        .exec()
    }
  }

  public async getAvailabilitieByDay (date: DateTime, spa?: Spa): Promise<Availability | null> {
    if (!spa) {
      return await Availability.query()
        .where('start_at', '<=', date.toSQL()!)
        .andWhere('end_at', '>=', date.toSQL()!)
        .first()
    } else {
      return await Availability.query()
        .where('start_at', '<=', date.toSQL()!)
        .andWhere('end_at', '>=', date.toSQL()!)
        .andWhere('spa_id', spa.id)
        .first()
    }
  }

  private getFirst<T> (items: T[]): T | undefined {
    return items?.[0]
  }

  public async journeyAreAvailable (
    startAt: DateTime,
    endAt: DateTime,
    spa: Spa
  ): Promise<
    { state: true; availability: Availability } | { state: false; code: number; message: string }
  > {
    const availability = await this.getAvailabilities(startAt, endAt, spa)

    const reservation = this.getFirst(await this.getReservations(startAt, endAt, spa))

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
      return {
        state: false,
        code: 1,
        message: 'the requested date can\'t be reserved',
      }
    }

    // check if the spa is available
    if (reservation) {
      return {
        state: false,
        code: 2,
        message: 'the spa is already reserved',
      }
    }

    return {
      state: true,
      availability: availability[0],
    }
  }

  public async nightIsAvailable (
    date: DateTime,
    spa: Spa
  ): Promise<
    { state: true; availability: Availability } | { state: false; code: number; message: string }
  > {
    const availability = await this.getAvailabilitieByDay(date, spa)

    const reservation = await this.getReservationByDay(date, date, spa)

    // check if the spa is available
    if (reservation) {
      return {
        state: false,
        code: 2,
        message: 'the spa is already reserved',
      }
    }

    return {
      state: true,
      availability: availability[0],
    }
  }

  public async dayIsAvailable (
    startAt: DateTime,
    endAt: DateTime,
    spa: Spa
  ): Promise<
    { state: true; availability: Availability } | { state: false; code: number; message: string }
  > {
    const availability = await this.getAvailabilities(startAt, endAt, spa)

    const reservation = this.getFirst(await this.getReservations(startAt, endAt, spa))

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
      return {
        state: false,
        code: 1,
        message: 'the requested date can\'t be reserved',
      }
    }

    // check if the spa is available
    if (reservation) {
      return {
        state: false,
        code: 2,
        message: 'the spa is already reserved',
      }
    }

    return {
      state: true,
      availability: availability[0],
    }
  }

  public async dateIsAvailable (
    date: DateTime,
    spa: Spa
  ): Promise<
    { state: true; availability: Availability } | { state: false; code: number; message: string }
  > {
    const availability = await this.getAvailabilitieByDay(date, spa)

    const reservation = await this.getReservationByDay(date, spa)

    // check if the spa is available
    if (reservation) {
      return {
        state: false,
        code: 2,
        message: 'the spa is already reserved',
      }
    }

    if (!availability) {
      return {
        state: false,
        code: 3,
        message: 'the spa is not available',
      }
    }

    return {
      state: true,
      availability: availability,
    }
  }

  public async datesIsAvailable (
    startAt: DateTime,
    endAt: DateTime,
    spa: Spa
  ): Promise<
    { state: true; availability: Availability[] } | { state: false; code: number; message: string }
  > {
    const availability = await this.getAvailabilities(startAt, endAt, spa)

    const reservation = this.getFirst(await this.getReservations(startAt, endAt, spa))

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
      return {
        state: false,
        code: 1,
        message: 'the requested date can\'t be reserved',
      }
    }

    // check if the spa is available
    if (reservation) {
      return {
        state: false,
        code: 2,
        message: 'the spa is already reserved',
      }
    }

    return {
      state: true,
      availability,
    }
  }
}
