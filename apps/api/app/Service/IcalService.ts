import ical from 'node-ical'
import { ICalCalendar } from 'ical-generator'
import AppBaseService from './AppBaseService'
import { DateTime } from 'luxon'

export default class IcalService implements AppBaseService {
  public parseIcal (icalString: string): ical.CalendarResponse {
    this.getVevents(ical.parseICS(icalString))
    return ical.parseICS(icalString)
  }

  public getVevents (ical: ical.CalendarResponse): [string, ical.VEvent][] {
    return Object.entries(ical).filter(([_, value]) => {
      return value?.type === 'VEVENT'
    }) as [string, ical.VEvent][]
  }

  public getVcalendar (ical: ical.CalendarResponse): [string, ical.CalendarComponent][] {
    return Object.entries(ical).filter(([_, value]) => {
      return value?.type === 'VCALENDAR'
    }) as [string, ical.CalendarComponent][]
  }

  public getVtimezone (ical: ical.CalendarResponse): [string, ical.VTimeZone][] {
    return Object.entries(ical).filter(([_, value]) => {
      return value?.type === 'VTIMEZONE'
    }) as [string, ical.VTimeZone][]
  }

  public async getAllVeventsFromIcalString (
    icalString: string,
    icalServiceProcessor: IcalServiceProvider
  ): Promise<{ blockedVevents: ical.VEvent[]; reservedVevents: ical.VEvent[] }> {
    const ical = this.parseIcal(icalString)
    const icalVevents = this.getVevents(ical)
    const blockedVevents = icalServiceProcessor.getBlockedVevents(icalVevents)
    const reservedVevents = icalServiceProcessor.getReservedVevents(icalVevents)
    return {
      blockedVevents: blockedVevents.map(([_, v]) => v),
      reservedVevents: reservedVevents.map(([_, v]) => v),
    }
  }
}

export interface IcalServiceProvider {
  getBlockedVevents: (vevents: [string, ical.VEvent][]) => [string, ical.VEvent][]
  getReservedVevents: (vevents: [string, ical.VEvent][]) => [string, ical.VEvent][]
}

export interface IcalServiceProcessor {
  addBlockedVevent: (
    calendar: ICalCalendar,
    meta: { start: DateTime; end: DateTime; summary: string }
  ) => ICalCalendar
  addReservedVevent: (
    calendar: ICalCalendar,
    meta: { start: DateTime; end: DateTime; summary: string }
  ) => ICalCalendar
}

export class AirbnbIcalService implements IcalServiceProvider {
  public getBlockedVevents (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary === 'Airbnb (Not available)'
    }) as [string, ical.VEvent][]
  }

  public getReservedVevents (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary.includes('Reserved')
    }) as [string, ical.VEvent][]
  }
}

export class BookingIcalService implements IcalServiceProvider {
  public getBlockedVevents (_: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return [] // this appear because booking does not have a blocked event
  }

  public getReservedVevents (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary.includes('CLOSED - Not available')
    }) as [string, ical.VEvent][]
  }
}

export class EscaleIcalService implements IcalServiceProcessor {
  public addBlockedVevent (): ICalCalendar {
    throw new Error('Method not implemented.') // this appear because escale does not have a blocked event
  }

  public addReservedVevent (
    calendar: ICalCalendar,
    meta: {
      start: DateTime
      end: DateTime
    }
  ): ICalCalendar {
    calendar.createEvent({
      start: meta.start.toJSDate(),
      end: meta.end.toJSDate(),
      summary: 'Reserved (Escale)',
    })

    return calendar
  }
}
