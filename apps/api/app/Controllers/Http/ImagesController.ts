import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Image from 'App/Models/Image'
import { ImageRessourcePostDto } from './dto/ImageDto/Post'
import File from 'App/Models/File'
import { ImageRessourceGetDto } from './dto/ImageDto/Get'
import { ImageRessourcePatchDto } from './dto/ImageDto/Patch'
import { ImageRessourceDeleteDto } from './dto/ImageDto/Delete'

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

    const file = await File.create({
      name: body.name || files.image.clientName,
      size: files.image.size,
      extname: files.image.extname,
    })

    const image = await Image.create(body)
    await image.related('file').associate(file)
    await image.load('file')

    await files.image.moveToDisk(image.directory, {name: image.serverFileName!})

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

  public async destroy ({ request, response }: HttpContextContract) {
    const dto = ImageRessourceDeleteDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform

    const image = params.id
    await image.delete()

    return response.ok({ message: 'Image deleted' })
  }
}
