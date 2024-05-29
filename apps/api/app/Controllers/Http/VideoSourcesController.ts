import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { VideoSourceRessourceGetCollectionDto } from './dto/VideoSourceDto/GetCollection'
import VideoSource from 'App/Models/VideoSource'

export default class VideoSourcesController {
  public async index({ response, request }: HttpContextContract) {
    const dto = VideoSourceRessourceGetCollectionDto.fromRequest(request)
    const errors = await dto.validate()
    if (errors.length) {
      return response.badRequest(errors)
    }

    const { query } = dto
    const { page, limit, ...rest } = query

    const videoSourceQuery = VideoSource.filter(rest)

    if (page || limit) {
      await videoSourceQuery.paginate(page || 1, limit || 10)
    }

    return response.ok(await videoSourceQuery.exec())
  }

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
