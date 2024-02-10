import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import { UsersRessourcePatchDto } from './dto/UsersDto/Patch'
import User from '../../Models/User'

export default class UsersController {
  public async index ({ response }: HttpContextContract) {
    return User.query()
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({ request, response, auth, params }: HttpContextContract) {
    const connectedUser = auth.use('jwt').user as User

    if (connectedUser.id !== Number(params.id)) {
      return response.unauthorized({
        message: 'You are not allowed to update this user',
      })
    }

    const dto = new UsersRessourcePatchDto({ body: request.body(), query: ['test'] })
    console.log(dto)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = dto

    const id = request.param('id')
    const user = await User.findOrFail(id)
    // await user.related('spaces').saveMany(await Space.findMany(body.spacesId || []))
    await await user.merge(body).save()
    return response.ok(user)
  }

  public async destroy ({}: HttpContextContract) {
    Database.from('users').delete()
  }
}
