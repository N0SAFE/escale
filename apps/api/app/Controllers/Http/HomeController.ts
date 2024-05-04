import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Home from 'App/Models/Home'
import { HomeRessourcePatchDto } from './dto/HomeDto/Patch'

export default class HomeController {
  public async index ({}: HttpContextContract) {
    return await Home.query().firstOrFail()
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({ response, request }: HttpContextContract) {
    const dto = await HomeRessourcePatchDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = await dto.after.customTransform

    const { commentIds, ...rest } = body

    const home = await Home.query().firstOrFail()

    await home.merge({
      description: rest.description,
      imageId: rest.imageId,
      videoId: rest.videoId,
      commentBackgroundImageId: rest.commentBackgroundImageId,
    })

    const homeComments = await home.related('homeComments').query().exec()
    await Promise.all(
      homeComments.map(async (homeComment) => {
        await homeComment.delete()
      })
    )
    await Promise.all(
      commentIds?.map(async (commentId) => {
        await home.related('homeComments').create({ commentId })
      }) || []
    )

    await home.save()

    await home.load('homeComments', (query) => {
      query.preload('comment')
    })

    return home
  }
}
