import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ExternalEventsRessourceBlockedDto } from './dto/ExternalEventsDto/Blocked'
import { ExternalEventsRessourceReservedDto } from './dto/ExternalEventsDto/Reserved'
import ExternalCalendarEvent from 'App/Models/ExternalCalendarEvent'

export default class ExternalEventsController {
  public async getBlockedDates ({ request, response }: HttpContextContract) {
    const dto = ExternalEventsRessourceBlockedDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform
    const externalCalendar = params.externalCalendar

    const blockedEvents = await ExternalCalendarEvent.query()
      .where('external_calendar_id', externalCalendar.id)
      .where('type', 'blocked')
      .orderBy('start_at', 'asc')
      .exec()

    return response.ok(blockedEvents)
  }

  public async getReservedDates ({ request, response }: HttpContextContract) {
    const dto = ExternalEventsRessourceReservedDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform
    const externalCalendar = params.externalCalendar

    const reservedEvents = await ExternalCalendarEvent.query()
      .where('external_calendar_id', externalCalendar.id)
      .where('type', 'reserved')
      .orderBy('start_at', 'asc')
      .exec()

    return response.ok(reservedEvents)
  }
}
