import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Availability from 'App/Models/Availability'
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'

export default class AvailabilitySeeder extends BaseSeeder {
  public async run () {
    const startDate = DateTime.now().minus({days: 4}).startOf('day')
    const endDate = startDate.plus({ days: 34 })

    // create a list of days between startDate and endDate
    const numberOfDays = endDate.diff(startDate, 'days').days
    const availabilitiesList = Array.from(
      Array.from({ length: numberOfDays }, (_, index) => {
        return startDate.plus({ days: index })
      })
        .reduce((acc, date) => {
          // check if the date is a weekend
          const weekNumber = date.weekNumber
          if (!acc.has(weekNumber)) {
            acc.set(weekNumber, { weekend: [], week: [] })
          }
          if (date.weekday === 5 || date.weekday === 6 || date.weekday === 7) {
            acc.get(weekNumber).weekend.push(date)
          } else {
            acc.get(weekNumber).week.push(date)
          }
          return acc
        }, new Map())
        .values()
    )
      .reduce((acc, week) => {
        acc.push({ type: 'week', dates: week.week })
        acc.push({ type: 'weekend', dates: week.weekend })
        return acc
      }, [])
      .map((d) => {
        const { dates, type } = d
        if (type === 'week' && dates.length > 0) {
          return {
            startAt: dates[0],
            endAt: dates[dates.length - 1],
            dayPrice: 9900,
            nightPrice: 14900,
            journeyPrice: 12000,
          }
        } else if (type === 'weekend' && dates.length > 0) {
          return {
            startAt: dates[0],
            endAt: dates[dates.length - 1],
            dayPrice: 12900,
            nightPrice: 19900,
            journeyPrice: 15000,
          }
        }
      })

    const availabilies = await Availability.createMany(availabilitiesList)
    await Promise.all(
      availabilies.map(async function (availability) {
        return availability.related('spa').associate(await Spa.firstOrFail())
      })
    )

    // const availbility = await Availability.firstOrFail()
    // await availbility.load('spa', (query) => {
    //   query.select('id').first()
    // })
    // console.log(availbility.spa.title)
  }
}
