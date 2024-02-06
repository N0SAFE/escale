import Env from '@ioc:Adonis/Core/Env'

export const stripeConfig = {
  secretKey: Env.get('STRIPE_SECRET_KEY'),
}
