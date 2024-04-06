import { DateTime } from 'luxon'
import ical from 'node-ical'
import ExternalCalendar from '../ExternalCalendar'
import AppBaseRepository from './AppBaseRepository'
import ExternalCalendarEvent from '../ExternalCalendarEvent'

export default class AirbnbCalendarEventRepository extends AppBaseRepository {
  protected model = ExternalCalendarEvent

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
    },
    from: 'airbnb' | 'booking'
  ) {
    const blockedEvents = blockedVevents.map((vevent) => {
      return {
        externalCalendarId: externalCalendar.id,
        startAt: DateTime.fromJSDate(vevent.start),
        endAt: DateTime.fromJSDate(vevent.end),
        type: 'blocked' as const,
        from,
      }
    })
    const reservedEvents = reservedVevents.map((vevent) => {
      return {
        externalCalendarId: externalCalendar.id,
        startAt: DateTime.fromJSDate(vevent.start),
        endAt: DateTime.fromJSDate(vevent.end),
        type: 'reserved' as const,
        from,
      }
    })
    await this.model.createMany([...blockedEvents, ...reservedEvents])
  }

  public getEvents (
    externalCalendarId: number,
    filter?: {
      startAt?: string
      endAt?: string
      type?: 'block' | 'reservation'
      from?: 'airbnb' | 'booking'
    }
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
    if (filter?.from) {
      query.where('from', filter.from)
    }
    return query.exec()
  }
}
