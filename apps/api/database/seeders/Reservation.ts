import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Availability from 'App/Models/Availability'
import Reservation from 'App/Models/Reservation'

export default class ReservationSeeder extends BaseSeeder {
  public async run () {
    const availabilities = await Availability.query().preload('spa').exec()
    const numberOfReservationsTryPerAvailability = 50
    const maxSizeOfReservations = 5
    const reservations: Reservation[] = []
    for (const availability of availabilities) {
      for (let index = 0; index < numberOfReservationsTryPerAvailability; index++) {
        // startAt has to be after the availability startAt but before the endAt
        const diffBetweenStartAndEnd = availability.endAt.diff(availability.startAt, 'days').days
        const startAt = availability.startAt.plus({
          days: Math.floor(Math.random() * diffBetweenStartAndEnd),
        })
        const diffBetweenStartAtAndAvailabilityEnd = availability.endAt.diff(startAt, 'days').days
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

        if (reservationIntersect) {
          continue
        }

        if (startAt >= endAt) {
          const reservation = await Reservation.create({
            startAt: endAt,
            endAt: startAt,
            spaId: availability.spa.id,
          })
          reservations.push(reservation)
          continue
        }

        const reservation = await Reservation.create({
          startAt: startAt,
          endAt: endAt,
          spaId: availability.spa.id,
        })
        reservations.push(reservation)
      }
    }
  }
}
