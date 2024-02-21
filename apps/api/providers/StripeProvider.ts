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
  private webhooks: Stripe.WebhookEndpoint[] = []
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
    if (!!Env.get('NODE_ENV') && Env.get('NODE_ENV') === 'production' && this.app.environment) {
      this.createWebhooks(this.stripe)
      // process.on('uncaughtException', this.shutdown)
      // process.on('unhandledRejection', this.shutdown)
      // process.on('exit', this.shutdown)
    }
  }

  public async shutdown () {
    this.removeWebhooks(this.stripe, this.webhooks)
  }

  private async removeWebhooks (stripe: Stripe, webhooks: Stripe.WebhookEndpoint[]) {
    console.log('removing webhooks')
    webhooks.forEach((endpoint) => {
      console.log('removing webhook', endpoint.id)
      stripe.webhookEndpoints.del(endpoint.id)
    })
  }

  private async createWebhooks (stripe: Stripe) {
    console.log('creating webhooks')
    const wehbook = await stripe.webhookEndpoints.create({
      url: Env.get('APP_URL') + '/webhook/stripe',
      enabled_events: [
        'payment_intent.payment_failed',
        'payment_intent.succeeded',
        'payment_intent.canceled',
      ],
    })
    console.log('created webhook', wehbook.id)
    this.webhooks.push(wehbook)
    const webhooks = this.webhooks
    const self = this
    function t () {
      self.removeWebhooks(stripe, webhooks)
      // process.off('SIGINT', t)
      // process.off('SIGQUIT', t)
      process.off('SIGTERM', t)
      process.off('exit', t)
    }
    // process.on('SIGINT', t) // CTRL+C
    // process.on('SIGQUIT', t) // Keyboard quit
    process.on('SIGTERM', t) // `kill` command
    process.on('exit', t) // on exit
  }
}
