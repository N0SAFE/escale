import { BaseTask, CronTimeV2 } from 'adonis5-scheduler/build/src/Scheduler/Task'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import ExternalCalendarEventRepository from 'App/Models/Repositories/ExternalCalendarEvent'
import IcalService, { AirbnbIcalService, BookingIcalService } from 'App/Service/IcalService'
import axios from 'axios'

export default class LoadExternalCalendar extends BaseTask {
  private icalService: IcalService = new IcalService()
  private airbnbIcalService: AirbnbIcalService = new AirbnbIcalService()
  private bookingIcalService: BookingIcalService = new BookingIcalService()
  private externalCalendarEventRepository: ExternalCalendarEventRepository =
    new ExternalCalendarEventRepository()

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
    from,
    service,
    calendarUrl,
    externalCalendar,
  }: {
    from: 'airbnb' | 'booking'
    service: AirbnbIcalService | BookingIcalService
    calendarUrl: string
    externalCalendar: ExternalCalendar
  }) {
    const airbnbEventIds = (
      await this.externalCalendarEventRepository.getEvents(externalCalendar.id, { from })
    ).map((event) => event.id)
    const { data: airbnbIcalString } = await axios.get(calendarUrl)
    const vevents = await this.icalService.getAllVeventsFromIcalString(airbnbIcalString, service)
    await this.externalCalendarEventRepository.createEvents(externalCalendar, vevents, from)
    await this.externalCalendarEventRepository.deleteEvents(airbnbEventIds)
  }

  public async handle () {
    const externalCalendars = await ExternalCalendar.all()
    await Promise.all(
      externalCalendars.map(async (externalCalendar) => {
        return Promise.all([
          await this.processLoadingExternalCalendar({
            from: 'airbnb',
            service: this.airbnbIcalService,
            calendarUrl: externalCalendar.airbnbCalendarUrl,
            externalCalendar,
          }),

          await this.processLoadingExternalCalendar({
            from: 'booking',
            service: this.bookingIcalService,
            calendarUrl: externalCalendar.bookingCalendarUrl,
            externalCalendar,
          }),
        ])
      })
    )
  }
}
