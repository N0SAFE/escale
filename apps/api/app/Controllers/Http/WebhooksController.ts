import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WebhooksController {
  public stripe ({ request, response }: HttpContextContract) {
    console.log(request.body())
    return response.ok('ui')
  }
}
