import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

export default class LoadJwtUser {
  public async handle ({ request, auth }: HttpContextContract, next: () => Promise<void>) {
    if (!request.headers().authorization && request.cookie('access_token')) {
      request.headers().authorization = `Bearer ${request.cookie('access_token')}`
    }
    Env.get('NODE_ENV') === 'development' && Logger.info('authenticating')
    try {
      await auth.use('jwt').authenticate()
    } catch (e) {}
    return await next()
  }
}
