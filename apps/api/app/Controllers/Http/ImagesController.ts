import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import Application from '@ioc:Adonis/Core/Application'
import { ImageRessourcePostDto } from './dto/ImageDto/Post'
import File from 'App/Models/File'
import { v4 as uuid } from 'uuid'
import { ImageRessourceGetDto } from './dto/ImageDto/Get'
import { ImageRessourcePatchDto } from './dto/ImageDto/Patch'

export default class ImagesController {
  public async index ({}: HttpContextContract) {
    return Image.all()
  }

  public async create ({}: HttpContextContract) {}

  public async store ({ request, response }: HttpContextContract) {
    const dto = ImageRessourcePostDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { files, body } = dto

    const u = uuid()

    await files.image.move(Application.tmpPath('uploads'), {
      name: u + '.' + files.image.extname,
    })

    const file = await File.create({
      name: files.image.clientName,
      size: files.image.size,
      uuid: u,
      extname: files.image.extname,
    })

    const image = await Image.create(body)
    await image.related('file').associate(file)
    await image.load('file')

    return response.ok(image)
  }

  public async show ({ request, response }: HttpContextContract) {
    const dto = ImageRessourceGetDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform
    return response.ok(params.id)
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({ request, response }: HttpContextContract) {
    const dto = ImageRessourcePatchDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params, body } = await dto.after.customTransform
    const image = params.id

    await image.merge(body, true).save()
    image.file?.merge(body, true).save()
    await image.load('file')
    return response.ok(image)
  }

  public async destroy ({}: HttpContextContract) {}
}
