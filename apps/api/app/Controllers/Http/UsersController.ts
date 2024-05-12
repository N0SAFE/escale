import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsersRessourcePatchDto } from './dto/UsersDto/Patch'
import User from 'App/Models/User'
import { UsersRessourceDeleteDto } from './dto/UsersDto/Delete'
import { UsersRessourceGetDto } from './dto/UsersDto/Get'

export default class UsersController {
  public async index ({}: HttpContextContract) {
    return User.query()
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({ request, response }: HttpContextContract) {
    const dto = UsersRessourceGetDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform
    const { id } = params

    return id
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({ request, response, auth, params }: HttpContextContract) {
    const connectedUser = auth.use('jwt').user as User

    if (connectedUser.id !== Number(params.id)) {
      return response.unauthorized({
        message: 'You are not allowed to update this user',
      })
    }

    const dto = UsersRessourcePatchDto.fromRequest(request)
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

  public async destroy ({ request, response }: HttpContextContract) {
    const dto = UsersRessourceDeleteDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform
    const { id } = params

    return response.ok(await id.delete())
  }
}
