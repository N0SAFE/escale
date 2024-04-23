// import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import Drive from '@ioc:Adonis/Core/Drive'
import InternalCalendar from 'App/Models/InternalCalendar'
import VideoSource from 'App/Models/VideoSource'

export default class AttachmentsController {
  public async imageById ({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const image = await Image.findOrFail(id)
    await image.load('file')
    // console.log(Application.appRoot + image.file.path)
    // console.log(image.path)
    // console.log(await Drive.exists(image.path!))
    if (!(await Drive.exists(image.path!))) {
      return response.status(404).send('Image not found')
    }
    return response.stream(await Drive.getStream(image.path!))
  }

  public async calendarById ({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const image = await InternalCalendar.findOrFail(id)
    if (!(await Drive.exists(image.path!))) {
      return response.status(404).send('Calendar not found')
    }
    return response.stream(await Drive.getStream(image.path!))
  }

  public async videoSourceById ({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const videoSource = await VideoSource.findOrFail(id)
    await videoSource.load('file')
    if (!(await Drive.exists(videoSource.path!))) {
      return response.status(404).send('Video not found')
    }
    return response.stream(await Drive.getStream(videoSource.path!))
  }
}
