import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import { ExternalCalendarRessourceGetDto } from './dto/ExternalCalendarDto/Get'

export default class ExternalCalendarsController {
  public async index ({ response }: HttpContextContract) {
    return response.ok(await ExternalCalendar.all())
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({ request, response }: HttpContextContract) {
    const dto = ExternalCalendarRessourceGetDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform
    return response.ok(params.id)
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
