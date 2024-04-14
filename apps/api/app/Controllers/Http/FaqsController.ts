import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Faq from 'App/Models/Faq'
import { FaqRessourceDeleteDto } from './dto/FaqDto/Delete'
import { FaqRessourcePatchDto } from './dto/FaqDto/Patch'
import { FaqRessourcePostDto } from './dto/FaqDto/Post'

export default class FaqsController {
  public async index ({}: HttpContextContract) {
    return await Faq.query().exec()
  }

  public async store ({ request, response }: HttpContextContract) {
    console.log(request.body())
    const dto = FaqRessourcePostDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      console.log('error')
      return response.badRequest(error)
    }

    const { body } = await dto.after.customTransform

    const faq = await Faq.create(body)

    console.log(faq)

    return response.ok(faq)
  }

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({ request, response }: HttpContextContract) {
    const dto = FaqRessourcePatchDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body, params } = await dto.after.customTransform

    console.log(body)

    const faq = params.id

    faq.merge(body)
    await faq.save()

    return response.ok(faq)
  }

  public async destroy ({ request, response }: HttpContextContract) {
    const dto = FaqRessourceDeleteDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform

    const faq = params.id

    await faq.delete()

    return response.ok({
      success: true,
      message: 'Faq deleted',
    })
  }
}
