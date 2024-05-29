import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ExternalCalendarEventsRessourceBlockedDto } from './dto/ExternalCalendarEventsDto/Blocked'
import { ExternalCalendarEventsRessourceReservedDto } from './dto/ExternalCalendarEventsDto/Reserved'
import ExternalCalendarEvent from 'App/Models/ExternalCalendarEvent'
import { ExternalCalendarEventsRessourceGetCollectionDto } from './dto/ExternalCalendarEventsDto/GetCollection'

export default class ExternalCalendarEventsController {
  public async index({ response, request }: HttpContextContract) {
    const dto = ExternalCalendarEventsRessourceGetCollectionDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { query, params } = await dto.after.customTransform
    const { startAt, endAt, ...rest } = query

    const ExternalCalendarEventsQuery = ExternalCalendarEvent.filter(rest)
      .where('external_calendar_id', params.externalCalendar)
      .where('start_at', '>=', startAt.toSQLDate()!)
      .where('end_at', '<=', endAt.toSQLDate()!)

    return response.ok(await ExternalCalendarEventsQuery.exec())
  }

  public async getBlockedDates({ request, response }: HttpContextContract) {
    const dto = ExternalCalendarEventsRessourceBlockedDto.fromRequest(request)
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

  public async getReservedDates({ request, response }: HttpContextContract) {
    const dto = ExternalCalendarEventsRessourceReservedDto.fromRequest(request)
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
