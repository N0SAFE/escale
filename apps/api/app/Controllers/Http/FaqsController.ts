import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Faq from 'App/Models/Faq'

export default class FaqsController {
  public async index ({}: HttpContextContract) {
    return Faq.all()
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
