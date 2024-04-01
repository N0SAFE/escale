import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { UnavailabilityRessourceGetCollectionDto } from './dto/UnavailabilityDto/GetCollection'
import Unavailability from 'App/Models/Unavailability'

export default class UnavailabilitiesController {
  public async index ({ request, response }: HttpContextContract) {
    const dto = UnavailabilityRessourceGetCollectionDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query } = await dto.after.customTransform
    const { page, limit, ...rest } = query
    const unavailabilityQuery = Unavailability.filter(rest)
    if (page || limit) {
      await unavailabilityQuery.paginate(page || 1, limit || 10)
    }
    unavailabilityQuery.orderBy('start_at', 'asc')
    return response.ok(await unavailabilityQuery.exec())
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
