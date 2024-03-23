import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Availability from 'App/Models/Availability'
import AvailabilityPrice from 'App/Models/AvailabilityPrice'
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'

export default class AvailabilitySeeder extends BaseSeeder {
  public async run () {
    const availabilities: Availability[] = []
    const startDate = DateTime.utc().minus({ days: 4 }).startOf('day')
    const endDate = startDate.plus({ days: 34 })
    const firstSpa = await Spa.firstOrFail()

    const availabilityPriceWeek = await AvailabilityPrice.create({
      day: 9900,
      night: 14900,
      journey: 12000,
    })

    const availabilityPriceWeekend = await AvailabilityPrice.create({
      day: 12900,
      night: 19900,
      journey: 15000,
    })

    const availability = await Availability.create({
      startAt: startDate,
      endAt: endDate,
      spaId: firstSpa.id,
    })

    await availability.related('monPrice').associate(availabilityPriceWeek)
    await availability.related('tuePrice').associate(availabilityPriceWeek)
    await availability.related('wedPrice').associate(availabilityPriceWeek)
    await availability.related('thuPrice').associate(availabilityPriceWeek)
    await availability.related('friPrice').associate(availabilityPriceWeek)
    await availability.related('satPrice').associate(availabilityPriceWeekend)
    await availability.related('sunPrice').associate(availabilityPriceWeekend)

    availabilities.push(availability)

    const numberOfAvailabiltiesToTry = 50
    const dayFromNowToCreateAvailabilities = 365
    const maxSizedOfAvailabilities = 30
    const maxDayPrice = 20000
    const maxNightPrice = 30000

    for (let index = 0; index < numberOfAvailabiltiesToTry; index++) {
      console.log(`trying creating availability ${index + 1} of ${numberOfAvailabiltiesToTry}`)
      const startAt =
        Math.random() < 0.5
          ? startDate.plus({ days: Math.floor(Math.random() * dayFromNowToCreateAvailabilities) })
          : startDate.minus({ days: Math.floor(Math.random() * dayFromNowToCreateAvailabilities) })
      const endAt = startAt.plus({ days: Math.floor(Math.random() * maxSizedOfAvailabilities) })

      const availabilityIntersects = availabilities.some((availability) => {
        return (
          (startAt >= availability.startAt && startAt <= availability.endAt) ||
          (endAt >= availability.startAt && endAt <= availability.endAt)
        )
      })

      if (availabilityIntersects) {
        continue
      }

      const availability = await Availability.create({
        startAt: startAt,
        endAt: endAt,
        spaId: firstSpa.id,
      })

      // get a number between 1 and 7
      const numberOfDifferentPrices = Math.floor(Math.random() * 7) + 1
      const promisePrices: Promise<AvailabilityPrice>[] = []
      for (let index = 0; index < numberOfDifferentPrices; index++) {
        const day = Math.floor(Math.random() * maxDayPrice)
        const night = Math.floor(Math.random() * maxNightPrice)
        const journey = Math.floor(Math.random() * (night - day) + day)
        promisePrices.push(
          AvailabilityPrice.create({
            day: day,
            night: night,
            journey: journey,
          })
        )
      }

      const prices = await Promise.all(promisePrices)
      const usedPrices: Set<AvailabilityPrice> = new Set()
      const promises: any[] = []

      const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      for (const day of days) {
        if (prices.length === 0) {
          break
        }
        const price = prices[Math.floor(Math.random() * prices.length)]
        usedPrices.add(price)
        // @ts-ignore
        promises.push(availability.related(`${day}Price`).associate(price))
      }

      for (const price of usedPrices) {
        const exist = prices.some((p) => p.id === price.id)
        if (exist) {
          continue
        }
        promises.push(price.delete())
      }

      promises.push(
        availability
          .related('monPrice')
          .associate(prices[Math.floor(Math.random() * prices.length)])
      )
      promises.push(
        availability
          .related('tuePrice')
          .associate(prices[Math.floor(Math.random() * prices.length)])
      )
      promises.push(
        availability
          .related('wedPrice')
          .associate(prices[Math.floor(Math.random() * prices.length)])
      )
      promises.push(
        availability
          .related('thuPrice')
          .associate(prices[Math.floor(Math.random() * prices.length)])
      )
      promises.push(
        availability
          .related('friPrice')
          .associate(prices[Math.floor(Math.random() * prices.length)])
      )
      promises.push(
        availability
          .related('satPrice')
          .associate(prices[Math.floor(Math.random() * prices.length)])
      )
      promises.push(
        availability
          .related('sunPrice')
          .associate(prices[Math.floor(Math.random() * prices.length)])
      )

      await Promise.all(promises)

      availabilities.push(availability)
    }
  }
}
