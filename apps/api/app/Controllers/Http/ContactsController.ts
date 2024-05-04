import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ContactRessourcePostDto } from './dto/ContactDto/Post'
import Contact from 'App/Models/Contact'

export default class ContactsController {
  public async index ({}: HttpContextContract) {}

  public async create ({}: HttpContextContract) {}

  public async store ({ request, response }: HttpContextContract) {
    const dto = new ContactRessourcePostDto({
      body: request.body(),
      query: request.qs(),
    })

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = await dto.after

    const contact = Contact.create({ ...body, read: false })

    return contact
  }

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
