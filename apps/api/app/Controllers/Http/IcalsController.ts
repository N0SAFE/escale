import { inject } from '@adonisjs/core/build/standalone'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import IcalService from 'App/Service/IcalService'

@inject()
export default class IcalsController {
  constructor (private icalService: IcalService) {}
  public async parse ({ response }: HttpContextContract) {
    return response.ok(this.icalService.parseIcal())
  }
}
