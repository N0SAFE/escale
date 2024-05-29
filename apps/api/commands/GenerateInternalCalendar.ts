import { BaseCommand } from '@adonisjs/core/build/standalone'
import Reservation from 'App/Models/Reservation'
import Spa from 'App/Models/Spa'
import { EscaleIcalService } from '../app/Service/IcalService'
import icalGenerator from 'ical-generator'
import InternalCalendar from 'App/Models/InternalCalendar'
import Drive from '@ioc:Adonis/Core/Drive'
import { DateTime } from 'luxon'

export default class GenerateInternalCalendar extends BaseCommand {
  private escaleIcalService: EscaleIcalService = new EscaleIcalService()
  /**
   * Command name is used to run the command
   */
  public static commandName = 'generate:calendar'

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

  public async run() {
    const spas = await Spa.query().preload('internalCalendar').exec()
    await Promise.all(
      spas.map(async (spa) => {
        const reservations = await Reservation.query()
          .where('spa_id', spa.id)
          .where('end_at', '>=', DateTime.now().toISODate())
          .exec()
        const calendar = icalGenerator()

        reservations.map((reservation) => {
          this.escaleIcalService.addReservedVevent(calendar, {
            start: reservation.startAt,
            end: reservation.endAt,
          })
        })

        if (spa.internalCalendar) {
          await spa.internalCalendar.delete()
        }

        const internalCalendar = await InternalCalendar.create({
          spaId: spa.id,
        })

        this.logger.success(
          `Internal calendar for spa ${spa.id} created at ${internalCalendar.path}`
        )

        await Drive.put(`${internalCalendar.path}`, calendar.toString())
      })
    )
  }
}
