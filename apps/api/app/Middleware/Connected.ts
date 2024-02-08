import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Connected {
  public async handle ({ response, auth }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      await auth.use('jwt').authenticate()
    } catch (e) {
      return response.unauthorized({ error: 'Unauthorized' })
    }
    await next()
  }
}
