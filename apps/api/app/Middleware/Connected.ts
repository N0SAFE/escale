import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Connected {
  public async handle ({ response, auth }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      const user = await auth.use('jwt').authenticate()
      if (!user) {
        return response.unauthorized({ error: 'Unauthorized' })
      }
    } catch (e) {
      // console.log(e)
      return response.unauthorized({ error: 'Unauthorized' })
    }
    await next()
  }
}
