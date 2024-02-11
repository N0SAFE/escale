import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import stripe from '@ioc:Stripe'
import { inject } from '@adonisjs/fold'
import ReservationService from 'App/Service/ReservationService'
import { CheckoutSessionRessourceDayOrNightSpaDto } from './dto/CheckoutSessionDto/DayOrNightSpa'

@inject()
export default class CheckoutSessionsController {
  constructor (protected reservationService: ReservationService) {}

  public async dayOrNightSpa ({ request, response }: HttpContextContract) {
    const dto = new CheckoutSessionRessourceDayOrNightSpaDto({
      body: request.body(),
      query: request.qs(),
    })

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body, query } = await dto.after.customTransform

    try {
      const res = await this.reservationService.getReservationByDate(body.date, body.spa)

      console.log(res)

      if (res) {
        return response.badRequest({ message: 'this day is already reserved' })
      }

      const availability = await this.reservationService.getAvailabilitieByDate(body.date, body.spa)

      if (!availability) {
        return response.badRequest({ message: 'this day is not available' })
      }

      const session = await stripe.checkout.sessions.create({
        payment_intent_data: {
          metadata: {
            spaId: body.spa.id,
            date: body.date.toISO(),
            type: query.type,
          },
        },
        payment_method_types: ['card', 'paypal'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'spa',
              },
              // unit_amount: query.type === 'day' ? availability.dayPrice : availability.nightPrice,
              // @flag enable night and journey
              unit_amount: availability.nightPrice,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: body.successUrl,
        cancel_url: body.cancelUrl,
      })
      return response.ok({ url: session.url })
    } catch (error) {
      console.log(error)
      return response.badRequest({ message: 'an error occured' })
    }
  }

  public async journeySpa ({ response }: HttpContextContract) {
    return response.badRequest({ message: 'not implemented' })
    // const dto = new CheckoutSessionRessourceJourneySpaDto({
    //   body: request.body(),
    //   query: request.qs(),
    // })

    // const error = await dto.validate()
    // if (error.length > 0) {
    //   return response.badRequest(error)
    // }

    // const { body } = await dto.after.customTransform

    // try {
    //   const res = await this.reservationService.datesIsAvailable(body.startAt, body.endAt, body.spa)

    //   if (!res.state) {
    //     return response.badRequest({ message: res.message })
    //   }

    //   const availabilities = res.availability

    //   const price = availabilities.reduce((acc, availability) => {
    //     const startAt = body.startAt
    //     const endAt = body.endAt
    //     const availabilityStartAt = availability.startAt
    //     const availabilityEndAt = availability.endAt
    //     const intersectionDuration = Math.min(
    //       endAt.diff(availabilityStartAt, 'days').days + 1,
    //       availabilityEndAt.diff(startAt, 'days').days + 1
    //     )
    //     return acc + intersectionDuration * availability.journeyPrice
    //   }, 0)

    //   const session = await stripe.checkout.sessions.create({
    //     payment_method_types: ['card', 'paypal'],
    //     line_items: [
    //       {
    //         price_data: {
    //           currency: 'eur',
    //           product_data: {
    //             name: 'spa',
    //           },
    //           unit_amount: price,
    //         },
    //         quantity: 1,
    //       },
    //     ],
    //     mode: 'payment',
    //     success_url: body.successUrl,
    //     cancel_url: body.cancelUrl,
    //   })
    //   return response.ok({ url: session.url })
    // } catch (error) {
    //   console.log(error)
    //   return response.badRequest({ message: 'an error occured' })
    // } @flag enable night and journey
  }
}
