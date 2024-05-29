import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Spa from 'App/Models/Spa'
import { DateTime } from 'luxon'

export default class WebhooksController {
  public async stripe({ request, response }: HttpContextContract) {
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

  public async handleSuceessPayment(body: any) {
    const paymentIntent = body.data.object
    const { spaId, startAt, endAt } = paymentIntent.metadata
    const spa = await Spa.findOrFail(spaId)
    console.log(paymentIntent.metadata)
    await spa.related('reservations').create({
      email: 'email', // @flag add email to the stripe session
      startAt: DateTime.fromISO(startAt),
      endAt: DateTime.fromISO(endAt),
    })
    console.log('reservation created')
  }
}
