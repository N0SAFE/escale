import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SpaRessourcePostDto } from './dto/SpaDto/Post'
import Spa from 'App/Models/Spa'

export default class SpasController {
  public async index ({ response }: HttpContextContract) {
    const spas = await Spa.all()

    return response.ok(spas)
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

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
