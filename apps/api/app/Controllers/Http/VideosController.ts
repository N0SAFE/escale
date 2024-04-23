import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { VideoRessourceGetCollectionDto } from './dto/VideoDto/GetCollection'
import Video from 'App/Models/Video'
import { VideoRessourcePostDto } from './dto/VideoDto/Post'
import Drive from '@ioc:Adonis/Core/Drive'
import File from 'App/Models/File'
import VideoSource from 'App/Models/VideoSource'

export default class VideosController {
  public async index ({ request, response }: HttpContextContract) {
    const dto = VideoRessourceGetCollectionDto.fromRequest(request)
    const errors = await dto.validate()
    if (errors.length) {
      return response.badRequest(errors)
    }

    const { query } = dto
    const { page, limit, ...rest } = query

    const videoQuery = Video.filter(rest)

    if (page || limit) {
      await videoQuery.paginate(page || 1, limit || 10)
    }

    return response.ok(await videoQuery.exec())
  }

  public async create ({}: HttpContextContract) {
    console.log('ui')
  }

  public async store ({ request, response }: HttpContextContract) {
    const dto = VideoRessourcePostDto.fromRequest(request)
    const errors = await dto.validate()
    if (errors.length) {
      return response.badRequest(errors)
    }

    const { body, files } = await dto.after.customTransform
    const sourcesFiles = files.sources

    const video = await Video.create(body)
    console.log('video')
    const sourcesData = await Promise.all(
      sourcesFiles.map(async (sourceFile) => {
        const fileInstance = await File.create({
          name: sourceFile.clientName,
          size: sourceFile.size,
          extname: sourceFile.extname,
        })
        const videoSourceInstance = await VideoSource.create({
          fileId: fileInstance.id,
        }).then(async (videoSourceInstance) => {
          await videoSourceInstance.load('file')
          return videoSourceInstance
        })
        return {
          fileInstance,
          videoSourceInstance,
          sourceFile,
        }
      })
    )

    try {
      await Promise.all(
        sourcesData.map(async ({ videoSourceInstance, sourceFile }) => {
          console.log(videoSourceInstance.file)
          await sourceFile.moveToDisk(videoSourceInstance.directory, {
            name: videoSourceInstance.file.uuid + '.' + videoSourceInstance.file.extname,
          })
        })
      )
    } catch (error) {
      console.log(error)
      await Promise.all(
        sourcesData.map(async ({ fileInstance, videoSourceInstance }) => {
          await Drive.delete(
            videoSourceInstance.directory + '/' + videoSourceInstance.serverFileName
          )
          await fileInstance.delete()
          await videoSourceInstance.delete()
        })
      )
      await video.delete()
      return response.badRequest('Error while saving files')
    }

    await video
      .related('sources')
      .saveMany(sourcesData.map(({ videoSourceInstance }) => videoSourceInstance))

    console.log('ui')
  }

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
