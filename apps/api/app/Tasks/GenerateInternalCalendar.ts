import { BaseTask, CronTimeV2 } from 'adonis5-scheduler/build/src/Scheduler/Task'
import Drive from '@ioc:Adonis/Core/Drive'
import { EscaleIcalService } from 'App/Service/IcalService'
import Spa from 'App/Models/Spa'
import Reservation from 'App/Models/Reservation'
import { DateTime } from 'luxon'
import icalGenerator from 'ical-generator'
import InternalCalendar from 'App/Models/InternalCalendar'

export default class GenerateInternalCalendar extends BaseTask {
  private escaleIcalService: EscaleIcalService = new EscaleIcalService()
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

  public async handle () {
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

        await Drive.put(`${internalCalendar.path}`, calendar.toString())
      })
    )
  }
}
