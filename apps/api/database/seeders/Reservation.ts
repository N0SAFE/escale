import Ace from '@ioc:Adonis/Core/Ace'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ExternalCalendarEvent from 'App/Models/ExternalCalendarEvent'
import Reservation from 'App/Models/Reservation'
import Spa from 'App/Models/Spa'

export default class ReservationSeeder extends BaseSeeder {
  public async run() {
    await Ace.exec('load:calendar', [])
    const spas = await Spa.query().preload('availability').preload('externalCalendar').exec()
    const numberOfReservationsTryPerAvailability = 50
    const numberOfTryPerIntersect = 3
    const maxSizeOfReservations = 5
    const reservations: Reservation[] = []
    for (const spa of spas) {
      const events = spa?.externalCalendar?.id
        ? await ExternalCalendarEvent.query()
            .where('externalCalendarId', spa.externalCalendar.id)
            .exec()
        : []
      for (const availability of spa.availability) {
        for (let index = 0; index < numberOfReservationsTryPerAvailability; index++) {
          for (let i = 0; i < numberOfTryPerIntersect; i++) {
            // startAt has to be after the availability startAt but before the endAt
            const diffBetweenStartAndEnd = availability.endAt.diff(
              availability.startAt,
              'days'
            ).days
            const startAt = availability.startAt.plus({
              days: Math.floor(Math.random() * diffBetweenStartAndEnd),
            })
            const diffBetweenStartAtAndAvailabilityEnd = availability.endAt.diff(
              startAt,
              'days'
            ).days
            const endAt = availability.endAt.minus({
              days: Math.max(
                Math.floor(Math.random() * diffBetweenStartAtAndAvailabilityEnd),
                maxSizeOfReservations
              ),
            })
            // check if the startAt and endAt intersect with another reservation
            const reservationIntersect = reservations.some((reservation) => {
              return (
                (startAt >= reservation.startAt && startAt <= reservation.endAt) ||
                (endAt >= reservation.startAt && endAt <= reservation.endAt) ||
                (startAt <= reservation.startAt && endAt >= reservation.endAt)
              )
            })

            const eventIntersect = events.some((event) => {
              return (
                (startAt >= event.startAt && startAt <= event.endAt) ||
                (endAt >= event.startAt && endAt <= event.endAt) ||
                (startAt <= event.startAt && endAt >= event.endAt)
              )
            })

            if (reservationIntersect || eventIntersect) {
              continue
            }

            if (startAt >= endAt) {
              const reservation = await Reservation.create({
                startAt: endAt,
                endAt: startAt,
                spaId: spa.id,
              })
              reservations.push(reservation)
            } else {
              const reservation = await Reservation.create({
                startAt: startAt,
                endAt: endAt,
                spaId: spa.id,
              })
              reservations.push(reservation)
            }

            break
          }
        }
      }
    }
    await Ace.exec('generate:calendar', [])
  }
}
