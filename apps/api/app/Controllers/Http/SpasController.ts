import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SpaRessourcePostDto } from './dto/SpaDto/Post'
import Spa from 'App/Models/Spa'

export default class SpasController {
  public async index ({ response }: HttpContextContract) {
    return response.ok(await Spa.all())
  }

  public async create ({}: HttpContextContract) {}

  public async store ({ request, response }: HttpContextContract) {
    const dto = new SpaRessourcePostDto({ body: request.body(), query: request.qs() })

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = dto.after

    const spa = await Spa.create(body)

    return response.ok(spa)
  }

  public async show ({ request, response }: HttpContextContract) {
    const spa = await Spa.findOrFail(request.param('id'))
    await spa.load('tags')
    await spa.load('services')
    return response.ok(spa)
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
