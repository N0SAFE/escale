import Availability from 'App/Models/Availability'
import Reservation from 'App/Models/Reservation'
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'
import AppBaseService from './AppBaseService'
import ExternalCalendar from 'App/Models/ExternalCalendar'

export type AvailableDate = {
  date: string
} & (
  | {
    isAvailable: false
    partial: false
    details: {
      tomorrow: 'no availability'
    }
  }
  | {
    isAvailable: false
    partial: false
    details: {
      yesterday: 'no availability'
    }
  }
  | {
    isAvailable: false
    partial: false
    details: {
      noAvailability: true
    }
  }
  | {
    isAvailable: false
    partial: false
    details: {
      dayStart: 'reservation' | 'external blocked' | 'external reserved'
      dayEnd: 'reservation' | 'external blocked' | 'external reserved'
    }
  }
  | {
    isAvailable: false
    partial: false
    details: {
      dayFull: 'reservation' | 'external blocked' | 'external reserved'
    }
  }
  | ({
    isAvailable: true
  } & (
    | {
      partial: 'departure'
      details: {
        tomorrow: 'no availability'
      }
    }
    | {
      partial: 'arrival'
      details: {
        yesterday: 'no availability'
      }
    }
    | {
      partial: 'departure'
      details: {
        dayStart: 'reservation' | 'external blocked' | 'external reserved'
      }
    }
    | {
      partial: 'arrival'
      details: {
        dayEnd: 'reservation' | 'external blocked' | 'external reserved'
      }
    }
    | {
      partial: false
    }
  ))
  | {
    isAvailable: true
    partial: false
  }
)

export default class AvailabilityService implements AppBaseService {
  public async getAvailableDates (
    spa: Spa,
    from: DateTime,
    to: DateTime,
    {
      includeExternalBlockedCalendarEvents,
      includeExternalReservedCalendarEvents,
      includeReservations,
      includeAvailabilities,
    }: {
      includeExternalBlockedCalendarEvents: boolean
      includeExternalReservedCalendarEvents: boolean
      includeReservations: boolean
      includeAvailabilities: boolean
    }
  ): Promise<AvailableDate[]> {
    async function getExternalBlockedEvents (externalCalendar: ExternalCalendar | null) {
      if (!externalCalendar) {
        return []
      }
      if (includeExternalBlockedCalendarEvents) {
        console.log('getting external blocked events')
        const airbnbEvents = await externalCalendar
          .related('airbnbEvents')
          .query()
          .where('type', 'blocked')
          .where('end_at', '>=', from.toSQLDate()!)
          .where('start_at', '<=', to.toSQLDate()!)
          .orderBy('start_at', 'asc')
          .exec()
        const bookingEvents = await externalCalendar
          .related('bookingEvents')
          .query()
          .where('type', 'blocked')
          .where('end_at', '>=', from.toSQLDate()!)
          .where('start_at', '<=', to.toSQLDate()!)
          .orderBy('start_at', 'asc')
          .exec()
        return [...airbnbEvents, ...bookingEvents]
      }
      return []
    }

    async function getExternalReservedEvents (externalCalendar: ExternalCalendar | null) {
      if (!externalCalendar) {
        return []
      }
      if (includeExternalReservedCalendarEvents) {
        console.log('getting external reserved events')
        const airbnbEvents = await externalCalendar
          .related('airbnbEvents')
          .query()
          .where('type', 'reserved')
          .where('end_at', '>=', from.toSQLDate()!)
          .where('start_at', '<=', to.toSQLDate()!)
          .orderBy('start_at', 'asc')
          .exec()
        const bookingEvents = await externalCalendar
          .related('bookingEvents')
          .query()
          .where('type', 'reserved')
          .where('end_at', '>=', from.toSQLDate()!)
          .where('start_at', '<=', to.toSQLDate()!)
          .orderBy('start_at', 'asc')
          .exec()
        return [...airbnbEvents, ...bookingEvents]
      }
      return []
    }

    type Events = {
      blockedEvents: Awaited<ReturnType<typeof getExternalBlockedEvents>>
      reservedEvents: Awaited<ReturnType<typeof getExternalReservedEvents>>
    }

    type Promisable = [Events, Availability[], Reservation[]]

    const [{ blockedEvents, reservedEvents }, availabilities, reservations]: Promisable =
      await Promise.all([
        new Promise<Events>(async (resolve) => {
          const externalCalendars =
            includeExternalBlockedCalendarEvents || includeExternalReservedCalendarEvents
              ? await spa.related('externalCalendar').query().first()
              : null

          resolve({
            blockedEvents: await getExternalBlockedEvents(externalCalendars),
            reservedEvents: await getExternalReservedEvents(externalCalendars),
          })
        }),
        includeAvailabilities
          ? spa
            .related('availability')
            .query()
            .where('end_at', '>=', from.toSQLDate()!)
            .where('start_at', '<=', to.toSQLDate()!)
            .exec()
          : Promise.resolve([]),
        includeReservations
          ? spa
            .related('reservations')
            .query()
            .where('end_at', '>=', from.toSQLDate()!)
            .where('start_at', '<=', to.toSQLDate()!)
            .exec()
          : Promise.resolve([]),
      ])

    const durationDayIsStart = function <T extends { startAt: DateTime; endAt: DateTime }> (
      duration: T,
      date: DateTime
    ) {
      return duration.startAt.toMillis() === date.toMillis()
    }

    const durationDayIsEnd = function <T extends { startAt: DateTime; endAt: DateTime }> (
      duration: T,
      date: DateTime
    ) {
      return duration.endAt.toMillis() === date.toMillis()
    }

    const durationDayIsInside = function <T extends { startAt: DateTime; endAt: DateTime }> (
      duration: T,
      date: DateTime
    ) {
      return duration.startAt < date && duration.endAt > date
    }

    // this function return true if the date is available for the spa
    const daysIsAvailable = function (date: DateTime, chain: boolean = false): AvailableDate {
      const yesterday = date.minus({ day: 1 })
      const tomorrrow = date.plus({ day: 1 })
      const availabilitiesArroundToday = includeAvailabilities
        ? availabilities.reduce<{
          today?: Availability
          yesterday?: Availability
          tomorrow?: Availability
        }>(
          (acc, a) => {
            return {
              today: acc.today ? acc.today : a.startAt <= date && a.endAt >= date ? a : undefined,
              yesterday: acc.yesterday
                ? acc.yesterday
                : a.startAt <= yesterday && a.endAt >= yesterday
                  ? a
                  : undefined,
              tomorrow: acc.tomorrow
                ? acc.tomorrow
                : a.startAt <= tomorrrow && a.endAt >= tomorrrow
                  ? a
                  : undefined,
            }
          },
          {
            yesterday: undefined,
            today: undefined,
            tomorrow: undefined,
          }
        )
        : undefined
      if (includeAvailabilities) {
        if (availabilitiesArroundToday?.today) {
          if (!availabilitiesArroundToday.yesterday && !availabilitiesArroundToday.tomorrow) {
            return {
              date: date.toISODate()!,
              isAvailable: true,
              partial: false,
            }
          }
        } else {
          return {
            date: date.toISODate()!,
            isAvailable: false,
            partial: false,
            details: {
              noAvailability: true,
            },
          }
        }
      }
      const isDayFull = reservations.some((r) => durationDayIsInside(r, date))
        ? 'reservation'
        : blockedEvents.some((e) => durationDayIsInside(e, date))
          ? 'external blocked'
          : reservedEvents.some((e) => durationDayIsInside(e, date))
            ? 'external reserved'
            : false
      if (isDayFull !== false) {
        return {
          date: date.toISODate()!,
          isAvailable: false,
          partial: false,
          details: {
            dayFull: isDayFull,
          },
        }
      }
      const dayHasStart = reservations.some((r) => durationDayIsStart(r, date))
        ? 'reservation'
        : blockedEvents.some((e) => durationDayIsStart(e, date))
          ? 'external blocked'
          : reservedEvents.some((e) => durationDayIsStart(e, date))
            ? 'external reserved'
            : false

      const dayHasEnd = reservations.some((r) => durationDayIsEnd(r, date))
        ? 'reservation'
        : blockedEvents.some((e) => durationDayIsEnd(e, date))
          ? 'external blocked'
          : reservedEvents.some((e) => durationDayIsEnd(e, date))
            ? 'external reserved'
            : false

      if (dayHasStart && dayHasEnd) {
        // count as a full day
        return {
          date: date.toISODate()!,
          isAvailable: false,
          partial: false,
          details: {
            dayStart: dayHasEnd,
            dayEnd: dayHasStart,
          },
        }
      }

      if (dayHasEnd !== false) {
        if (chain === false && daysIsAvailable(date.plus({ day: 1 }), true).isAvailable === false) {
          return {
            date: date.toISODate()!,
            isAvailable: false,
            partial: false,
            details: {
              dayFull: dayHasEnd,
            },
          }
        }
        if (includeAvailabilities && !availabilitiesArroundToday?.tomorrow) {
          return {
            date: date.toISODate()!,
            isAvailable: false,
            partial: false,
            details: {
              tomorrow: 'no availability',
            },
          }
        }
        return {
          date: date.toISODate()!,
          isAvailable: true,
          partial: 'arrival',
          details: {
            dayEnd: dayHasEnd,
          },
        }
      }
      if (dayHasStart !== false) {
        if (
          chain === false &&
          daysIsAvailable(date.minus({ day: 1 }), true).isAvailable === false
        ) {
          return {
            date: date.toISODate()!,
            isAvailable: false,
            partial: false,
            details: {
              dayFull: dayHasStart,
            },
          }
        }
        if (includeAvailabilities && !availabilitiesArroundToday?.yesterday) {
          return {
            date: date.toISODate()!,
            isAvailable: false,
            partial: false,
            details: {
              yesterday: 'no availability',
            },
          }
        }
        return {
          date: date.toISODate()!,
          isAvailable: true,
          partial: 'departure',
          details: {
            dayStart: dayHasStart,
          },
        }
      }
      if (availabilitiesArroundToday) {
        if (!availabilitiesArroundToday.yesterday) {
          return {
            date: date.toISODate()!,
            isAvailable: true,
            partial: 'arrival',
            details: {
              yesterday: 'no availability',
            },
          }
        }
        if (!availabilitiesArroundToday.tomorrow) {
          return {
            date: date.toISODate()!,
            isAvailable: true,
            partial: 'departure',
            details: {
              tomorrow: 'no availability',
            },
          }
        }
      }

      return {
        date: date.toISODate()!,
        isAvailable: true,
        partial: false,
      }
    }

    const days = to.diff(from, 'days').days
    return Promise.all(
      Array.from({ length: days }).map((_, i) => {
        const date = from.plus({ days: i })
        return daysIsAvailable(date)
      })
    )
  }
}
