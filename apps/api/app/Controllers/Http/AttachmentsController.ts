import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'

export default class AttachmentsController {
  public async imageById ({ request, response }: HttpContextContract) {
    const { id } = request.params()
    const image = await Image.findOrFail(id)
    await image.load('file')
    return response.attachment(Application.appRoot + image.file.path)
  }
}
