import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Service from 'App/Models/Service'
import { ServiceRessourcePatchDto } from './dto/ServiceDto/Patch'
import Image from 'App/Models/Image'

export default class ServicesController {
  public async index ({}: HttpContextContract) {
    return Service.query()
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({}: HttpContextContract) {
    return Service.findOrFail(1)
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({ request, response }: HttpContextContract) {
    const dto = ServiceRessourcePatchDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body, params } = await dto.after.customTransform

    const service = params.id
    service.merge(body, true)
    if (body.image) {
      await service.related('image').associate(await Image.findOrFail(body.image))
    } else {
      if (body.image === null) {
        await service.related('image').dissociate()
      }
    }

    await service.load('image')
    await service.save()

    return response.ok(service)
  }

  public async destroy ({}: HttpContextContract) {}
}
