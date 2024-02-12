import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Rule from 'App/Models/Rule'

export default class RulesController {
  public async index ({}: HttpContextContract) {
    return Rule.all()
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
