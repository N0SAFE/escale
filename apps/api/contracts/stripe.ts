declare module '@ioc:Stripe' {
  import type Stripe from 'stripe'

  const stripe: Stripe

  export default stripe
}
