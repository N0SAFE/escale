import fs from 'fs'
import ical from 'node-ical'
import { ICalCalendar } from 'ical-generator'

export default class IcalService {
  public parseIcal () {
    const icalString = fs.readFileSync(__dirname + '/calendar.ics', 'utf8')
    console.log(ical.parseICS(icalString))
    console.log(ical.parseICS(fs.readFileSync(__dirname + '/export.ics', 'utf8')))
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

  public getAirbnbNotAvailableVevents (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary.includes('Not available')
    }) as [string, ical.VEvent][]
  }

  public getReservationsVevents (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary.includes('Reservation')
    }) as [string, ical.VEvent][]
  }
}

interface IcalServiceFor {
  getVeventsNotAvailable: (vevents: [string, ical.VEvent][]) => [string, ical.VEvent][]
  getVeventsReservations: (vevents: [string, ical.VEvent][]) => [string, ical.VEvent][]
}

export class IcalServiceAirbnb implements IcalServiceFor {
  public getVeventsNotAvailable (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary.includes('Airbnb (Not available)')
    }) as [string, ical.VEvent][]
  }

  public getVeventsReservations (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary.includes('Reserved')
    }) as [string, ical.VEvent][]
  }
}

export class IcalServiceBooking implements IcalServiceFor {
  public getVeventsNotAvailable (_: [string, ical.VEvent][]): [string, ical.VEvent][] {
    throw new Error('Method not implemented.') // this appear because booking does not have a not available event
  }

  public getVeventsReservations (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary.includes('CLOSED - Not available')
    }) as [string, ical.VEvent][]
  }
}

export class IcalServiceEscale implements IcalServiceFor {
  public getVeventsNotAvailable (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary.includes('Not available')
    }) as [string, ical.VEvent][]
  }

  public getVeventsReservations (vevents: [string, ical.VEvent][]): [string, ical.VEvent][] {
    return vevents.filter(([_, vevent]) => {
      return vevent.summary.includes('Reserved')
    }) as [string, ical.VEvent][]
  }

  public addVeventNotAvailable (start: Date, end: Date, calendar: ICalCalendar): ICalCalendar {
    calendar.createEvent({
      start: start,
      end: end,
      summary: 'Not available',
    })

    calendar

    return calendar
  }
}
