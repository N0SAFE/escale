import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import User from 'App/Models/User'
import AuthLoginDto from './dto/AuthDto/Login'
import AuthRegisterDto from './dto/AuthDto/Register'

export default class AuthController {
  public async login ({ request, auth, response }: HttpContextContract) {
    const dto = new AuthLoginDto({ body: request.body() })
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = dto

    try {
      const jwt = await auth.use('jwt').attempt(body.email, body.password)
      // response.cookie('access_token', jwt.accessToken, {
      //   httpOnly: false,
      //   path: '/',
      //   sameSite: undefined,
      //   secure: undefined,
      //   expires: undefined,
      //   maxAge: undefined,
      // })
      if (body.rememberMe) {
        // response.cookie('refresh_token', jwt.refreshToken, {
        //   httpOnly: true,
        //   path: '/',
        //   sameSite: 'none',
        //   secure: true,
        // })
      } else {
        response.clearCookie('refresh_token')
      }
      // console.log(jwt.refreshToken)
      return response.ok({ ...jwt.toJSON(), success: true })
    } catch (error) {
      if (
        error.code === 'ER_DUP_ENTRY' &&
        error.sqlMessage.includes('jwt_tokens.jwt_tokens_token_unique')
      ) {
        return response.badRequest({ message: 'too many request', success: false })
      }
      if (
        error.code === 'ECONNREFUSED' ||
        error.code === 'ER_ACCESS_DENIED_NO_PASSWORD_ERROR' ||
        error.code === 'ER_ACCESS_DENIED_ERROR' ||
        error.code === 'ER_DBACCESS_DENIED_ERROR' ||
        error.code === 'ER_DBACCESS_DENIED_ERROR'
      ) {
        return response.badRequest({ message: 'database connection refused', success: false })
      }
      return response.unauthorized({ message: 'invalid credentials', success: false })
    }
  }

  public async logout ({ auth, response }: HttpContextContract) {
    response.clearCookie('access_token')
    response.clearCookie('refresh_token')
    // console.log(request.headers())
    // console.log(auth.use('jwt').user)
    if (!auth.use('jwt').user) {
      return response.unauthorized({ message: 'no credentials provided', success: false })
    }
    try {
      await auth.use('jwt').logout()
    } catch (error) {
      return response.badRequest({ message: 'unable to logout', success: false })
    }
    return response.ok({ message: 'logged out', success: true })
  }

  public async register ({ auth, request, response }: HttpContextContract) {
    const dto = new AuthRegisterDto({ body: request.body() })
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = dto

    const userExists = await Database.from('users').where('email', body.email).first()

    if (userExists) {
      return response.unauthorized({ message: 'user already exists', success: false })
    }

    const user = await User.create({
      email: body.email,
      password: body.password,
    })

    const jwt = await auth.use('jwt').login(user)
    response.cookie('access_token', jwt.accessToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'none',
      secure: true,
    })

    if (body.rememberMe) {
      response.cookie('refresh_token', jwt.refreshToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      })
    } else {
      response.clearCookie('refresh_token')
    }
    return response.created({ ...jwt.toJSON(), success: true })
  }

  public async refresh ({ auth, request, response }: HttpContextContract) {
    const refreshToken = request.cookie('refresh_token') || request.header('refresh_token')
    if (!refreshToken) {
      return response.unauthorized({ message: 'no refresh token provided', success: false })
    }
    // console.log(refreshToken)
    try {
      const jwt = await auth.use('jwt').loginViaRefreshToken(refreshToken)
      // console.log('io')
      response.cookie('access_token', jwt.accessToken, {
        httpOnly: true,
        path: '/',
        sameSite: 'none',
        secure: true,
      })
      response.cookie('refresh_token', jwt.refreshToken, {
        httpOnly: true,
        path: '/refresh',
        sameSite: 'none',
        secure: true,
      })
      return response.ok({ ...jwt.toJSON(), success: true })
    } catch (error) {
      // console.log(error)
      return response.unauthorized({ message: 'invalid refresh token', success: false })
    }
  }

  public async whoami ({ auth, response }: HttpContextContract) {
    try {
      return response.ok({
        user: auth.use('jwt').user,
        payload: auth.use('jwt').payload,
        ...auth.use('jwt').toJSON(),
      })
    } catch (error) {
      // console.log(error)
      return response.ok({
        user: auth.use('jwt').user,
        payload: auth.use('jwt').payload,
        ...auth.use('jwt').toJSON(),
      })
    }
  }
}
