import { BaseTask, CronTimeV2 } from 'adonis5-scheduler/build/src/Scheduler/Task'
import IcalService, { BookingIcalService } from 'App/Service/IcalService'
import { AirbnbIcalService } from '../Service/IcalService'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import axios from 'axios'
import AirbnbCalendarEventRepository from '../Models/Repositories/AirbnbCalendarEvent'
import BookingCalendarEventRepository from 'App/Models/Repositories/BookingCalendarEvent'

export default class LoadExternalCalendar extends BaseTask {
  private icalService: IcalService = new IcalService()
  private airbnbIcalService: AirbnbIcalService = new AirbnbIcalService()
  private bookingIcalService: BookingIcalService = new BookingIcalService()
  private airbnbCalendarEventRepository: AirbnbCalendarEventRepository =
    new AirbnbCalendarEventRepository()
  private bookingCalendarEventRepository: BookingCalendarEventRepository =
    new BookingCalendarEventRepository()

  public static get schedule () {
    // Use CronTimeV2 generator:
    return CronTimeV2.everyHourAt(0)
    // or just use return cron-style string (simple cron editor: crontab.guru)
  }
  /**
   * Set enable use .lock file for block run retry task
   * Lock file save to `build/tmp/adonis5-scheduler/locks/your-class-name`
   */
  public static get useLock () {
    return true
  }

  public async processLoadingExternalCalendar ({
    repository,
    service,
    calendarUrl,
    externalCalendar,
  }: {
    repository: AirbnbCalendarEventRepository | BookingCalendarEventRepository
    service: AirbnbIcalService | BookingIcalService
    calendarUrl: string
    externalCalendar: ExternalCalendar
  }) {
    const airbnbEventIds = (await repository.getEvents(externalCalendar.id)).map(
      (event) => event.id
    )
    const { data: airbnbIcalString } = await axios.get(calendarUrl)
    const vevents = await this.icalService.getAllVeventsFromIcalString(airbnbIcalString, service)
    await repository.createEvents(externalCalendar, vevents)
    await repository.deleteEvents(airbnbEventIds)
  }

  public async handle () {
    const externalCalendars = await ExternalCalendar.all()
    await Promise.all(
      externalCalendars.map(async (externalCalendar) => {
        return Promise.all([
          await this.processLoadingExternalCalendar({
            repository: this.airbnbCalendarEventRepository,
            service: this.airbnbIcalService,
            calendarUrl: externalCalendar.airbnbCalendarUrl,
            externalCalendar,
          }),

          await this.processLoadingExternalCalendar({
            repository: this.bookingCalendarEventRepository,
            service: this.bookingIcalService,
            calendarUrl: externalCalendar.bookingCalendarUrl,
            externalCalendar,
          }),
        ])
      })
    )
  }
}
