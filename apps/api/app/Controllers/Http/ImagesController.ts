import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import { ImageRessourceAttachementDto } from './dto/ImageDto/Attachement'
import Application from '@ioc:Adonis/Core/Application'
import { ImageRessourcePostDto } from './dto/ImageDto/Post'
import File from 'App/Models/File'
import { v4 as uuid } from 'uuid'

export default class ImagesController {
  public async index ({}: HttpContextContract) {
    return Image.all()
  }

  public async create ({}: HttpContextContract) {}

  public async store ({ request }: HttpContextContract) {
    const dto = ImageRessourcePostDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return error
    }

    const { files, body } = dto

    const u = uuid()

    console.log(u)

    await files.image.move(Application.tmpPath('uploads'), {
      name:  u,
    })

    const file = await File.create({
      name: files.image.clientName,
      size: files.image.size,
      uuid: u,
    })

    const image = await Image.create(body)
    await image.related('file').associate(file)
    await image.load('file')

    return image
  }

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
