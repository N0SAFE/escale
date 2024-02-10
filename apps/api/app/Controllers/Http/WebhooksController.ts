import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Reservation from 'App/Models/Reservation'
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'
import stripe from '@ioc:Stripe'

export default class WebhooksController {
  public async stripe ({ request, response }: HttpContextContract) {
    const body = request.body()
    switch (body.type) {
      case 'payment_intent.succeeded':
        await this.handleSuceessPayment(body)
        break
      case 'payment_intent.payment_failed':
        console.log('Payment failed')
        break
      case 'payment_intent.canceled':
        console.log('Payment was canceled')
        break
    }
    return response.ok('ui')
  }

  public async handleSuceessPayment (body: any) {
    const paymentIntent = body.data.object
    const { type, spaId } = paymentIntent.metadata
    if (type === 'night') {
      const spa = await Spa.findOrFail(spaId)
      const reservation = await Reservation.create({
        email: 'email', // @flag add email to the stripe session
      })
      await reservation.related('nightReservation').create({
        date: DateTime.fromISO(body.data.object.metadata.date),
      })
      await reservation.related('spa').associate(spa)
      console.log('Night reservation created')
    }
  }
}
