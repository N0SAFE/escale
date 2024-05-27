import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UsersRessourcePatchDto } from './dto/UsersDto/Patch'
import User from 'App/Models/User'
import { UsersRessourceDeleteDto } from './dto/UsersDto/Delete'
import { UsersRessourceGetDto } from './dto/UsersDto/Get'
import Role from 'App/Models/Role'
import { UsersRessourceGetCollectionDto } from './dto/UsersDto/GetCollection'
import { UsersRessourcePostDto } from './dto/UsersDto/Post'

export default class UsersController {
  public async index ({ request, response }: HttpContextContract) {
    const dto = UsersRessourceGetCollectionDto.fromRequest(request)
    const error = await dto.validate()

    if (error.length > 0) {
      return response.badRequest(error)
    }
    const { query } = dto
    const { page, limit, ...rest } = query

    const userQuery = User.filter(rest)

    if (page || limit) {
      await userQuery.paginate(page || 1, limit || 10)
    }

    return response.ok(await userQuery.exec())

    // const paginator = await (async () => {
    //   if (page || limit) {
    //     return await userQuery.paginate(
    //       page === 'undefined' ? 1 : page || 1,
    //       limit === 'undefined' ? 10 : limit || 10
    //     )
    //   }
    // })() //

    // return response.ok({
    //   data: await userQuery.exec(),
    //   context: { paginator: { ...(paginator?.getMeta() || {}) } },
    // }) @flag server-side-pagination
  }

  public async create ({}: HttpContextContract) {}

  public async store ({ request, response }: HttpContextContract) {
    const dto = UsersRessourcePostDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = dto
    return response.ok(await User.create(body))
  }

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
    const adminRole = await Role.query().where('label', 'admin').firstOrFail()
    const connectedUser = auth.use('jwt').user as User

    if (
      connectedUser.id !== Number(params.id) &&
      !connectedUser.roles.some((role) => role.id === adminRole.id)
    ) {
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
