import { DateTime } from 'luxon'
import BookingCalendarEvent from '../BookingCalendarEvent'
import AppBaseRepository from './AppBaseRepository'
import ical from 'node-ical'
import ExternalCalendar from '../ExternalCalendar'

export default class BookingCalendarEventRepository extends AppBaseRepository {
  protected model = BookingCalendarEvent

  public async deleteEvents (ids: number[]) {
    await this.model.query().whereIn('id', ids).delete()
  }

  public async createEvents (
    externalCalendar: ExternalCalendar,
    {
      blockedVevents,
      reservedVevents,
    }: {
      blockedVevents: ical.VEvent[]
      reservedVevents: ical.VEvent[]
    }
  ) {
    const blockedEvents = blockedVevents.map((vevent) => {
      return {
        externalCalendarId: externalCalendar.id,
        startAt: DateTime.fromJSDate(vevent.start).toUTC(),
        endAt: DateTime.fromJSDate(vevent.end).toUTC(),
        type: 'blocked' as const,
      }
    })
    const reservedEvents = reservedVevents.map((vevent) => {
      return {
        externalCalendarId: externalCalendar.id,
        startAt: DateTime.fromJSDate(vevent.start).toUTC(),
        endAt: DateTime.fromJSDate(vevent.end).toUTC(),
        type: 'reserved' as const,
      }
    })
    await this.model.createMany([...blockedEvents, ...reservedEvents])
  }

  public getEvents (
    externalCalendarId: number,
    filter?: { startAt?: string; endAt?: string; type?: 'block' | 'reservation' }
  ) {
    const query = this.model.query().where('external_calendar_id', externalCalendarId)
    if (filter?.startAt) {
      query.where('start_at', '>=', filter.startAt)
    }
    if (filter?.endAt) {
      query.where('end_at', '<=', filter.endAt)
    }
    if (filter?.type) {
      query.where('type', filter.type)
    }
    return query.exec()
  }
}
