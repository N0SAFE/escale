import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoadJwtUser {
  public async handle ({ request, auth }: HttpContextContract, next: () => Promise<void>) {
    if (!request.headers().authorization && request.cookie('access_token')) {
      request.headers().authorization = `Bearer ${request.cookie('access_token')}`
    }
    try {
      await auth.use('jwt').authenticate()
    } catch (e) {}
    return await next()
  }
}
