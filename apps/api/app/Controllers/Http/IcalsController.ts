import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IcalService, { AirbnbIcalService } from 'App/Service/IcalService'
import axios from 'axios'

@inject()
export default class IcalsController {
  constructor (private icalService: IcalService, private airbnbIcalService: AirbnbIcalService) {}
  public async parse ({ response }: HttpContextContract) {
    const { data } = await axios.get(
      'https://www.airbnb.com/calendar/ical/1080153087993682153.ics?s=f74db1de5d2746db904dd4d2c9710475&locale=fr'
    )
    // const { data } = await axios.get('https://ical.booking.com/v1/export?t=30385c97-6c90-4226-9140-cce18ba1b4c9')
    const ical = this.icalService.parseIcal(data)
    const vevents = this.icalService.getVevents(ical)
    console.log(vevents)
    const blockedVevents = this.airbnbIcalService.getBlockedVevents(vevents)
    console.log(blockedVevents)
    const reservedVevents = this.airbnbIcalService.getReservedVevents(vevents)
    console.log(reservedVevents)

    return response.ok(ical)
  }
}
