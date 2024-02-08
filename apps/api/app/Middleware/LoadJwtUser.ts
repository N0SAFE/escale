import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

export default class LoadJwtUser {
  public async handle ({ response, request, auth }: HttpContextContract, next: () => Promise<void>) {
    if (!request.headers().authorization && request.cookie('access_token')) {
      request.headers().authorization = `Bearer ${request.cookie('access_token')}`
    }
    Env.get('NODE_ENV') === 'development' && Logger.info('authenticating')
    try {
      await auth.use('jwt').authenticate()
    } catch (e) {
      if (request.cookie('refresh_token')) {
        const refreshToken = request.cookie('refresh_token')
        try {
          const jwt = await auth.use('jwt').loginViaRefreshToken(refreshToken)
          response.cookie('access_token', jwt.accessToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'none',
            secure: true,
          })
          response.cookie('refresh_token', jwt.refreshToken, {
            httpOnly: true,
            path: '/',
            sameSite: 'none',
            secure: true,
          })
        } catch (e) {}
      }
    }
    return await next()
  }
}
