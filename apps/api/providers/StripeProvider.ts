import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Stripe from 'stripe'
import Env from '@ioc:Adonis/Core/Env'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class StripeProvider {
  private stripe: Stripe
  constructor (protected app: ApplicationContract) {}

  public register () {
    const { stripeConfig } = this.app.config.get('stripe')
    this.stripe = new Stripe(stripeConfig.secretKey)
    this.app.container.singleton('Stripe', () => {
      return this.stripe
    })
  }

  public async boot () {
    // All bindings are ready, feel free to use them
  }

  public async ready () {
    if (!!Env.get('NODE_ENV') && Env.get('NODE_ENV') === 'production') {
      await this.stripe.webhookEndpoints.create({
        url: Env.get('APP_URL') + '/webhook/stripe',
        enabled_events: [
          'payment_intent.payment_failed',
          'payment_intent.succeeded',
          'payment_intent.canceled',
        ],
      })
    }
  }

  public async shutdown () {
    console.log('shutdown')
    this.stripe.webhookEndpoints.list().then((endpoints) => {
      endpoints.data.forEach((endpoint) => {
        this.stripe.webhookEndpoints.del(endpoint.id)
      })
    })
  }
}
