import { BaseCommand } from '@adonisjs/core/build/standalone'
import ExternalCalendar from 'App/Models/ExternalCalendar'
import ExternalCalendarEventRepository from 'App/Models/Repositories/ExternalCalendarEvent'
import IcalService, { AirbnbIcalService, BookingIcalService } from 'App/Service/IcalService'
import axios from 'axios'

export default class LoadExternalCalendar extends BaseCommand {
  private icalService: IcalService = new IcalService()
  private airbnbIcalService: AirbnbIcalService = new AirbnbIcalService()
  private bookingIcalService: BookingIcalService = new BookingIcalService()
  private externalCalendarEventRepository: ExternalCalendarEventRepository =
    new ExternalCalendarEventRepository()

  /**
   * Command name is used to run the command
   */
  public static commandName = 'load:calendar'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async processLoadingExternalCalendar({
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

  public async run() {
    const spinner = this.logger.await('loading external calendar', 'load:calendar')
    try {
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
      spinner.stop()
      this.logger.success('external calendar loaded', 'load:calendar')
    } catch (error) {
      spinner.stop()
      this.logger.error('failed to load external calendar ' + error.stack, 'load:calendar')
    }
  }
}
