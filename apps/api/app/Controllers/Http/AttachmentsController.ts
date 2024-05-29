// import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Drive from '@ioc:Adonis/Core/Drive'
import InternalCalendar from 'App/Models/InternalCalendar'

export default class AttachmentsController {
  public async calendarById({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const image = await InternalCalendar.findOrFail(id)
    if (!(await Drive.exists(image.path!))) {
      return response.status(404).send('Calendar not found')
    }
    return response.stream(await Drive.getStream(image.path!))
  }
}
