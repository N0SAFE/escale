import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Home from 'App/Models/Home'
import { HomeRessourcePatchDto } from './dto/HomeDto/Patch'

export default class HomeController {
  public async index ({}: HttpContextContract) {
    return await Home.query()
      .preload('image')
      .preload('video')
      .preload('homeComments', (query) => {
        query.preload('comment')
      })
      .firstOrFail()
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

    console.log(rest)
    console.log(commentIds)

    const home = await Home.query()
      .preload('image')
      .preload('video')
      .preload('homeComments', (query) => {
        query.preload('comment')
      })
      .firstOrFail()

    await home.merge({
      description: rest.description,
      imageId: rest.imageId,
      videoId: rest.videoId,
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
