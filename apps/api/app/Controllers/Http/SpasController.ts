import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { SpaRessourcePostDto } from './dto/SpaDto/Post'
import Spa from 'App/Models/Spa'
import Image from 'App/Models/Image'
import File from 'App/Models/File'
import { v4 as uuid } from 'uuid'
import { SpaImageRessourcePostDto } from './dto/SpaDto/ImageDto/Post'
import SpaImage from 'App/Models/SpaImage'
import { SpaImageRessourceSortDto } from './dto/SpaDto/ImageDto/Sort'
import { SpaImageRessourceDeleteDto } from './dto/SpaDto/ImageDto/Delete'
import { SpaRessourcePatchDto } from './dto/SpaDto/Patch'
import { SpaRessourceGetDto } from './dto/SpaDto/Get'
import { SpaRessourceDeleteDto } from './dto/SpaDto/Delete'

export default class SpasController {
  public async index ({ response, request }: HttpContextContract) {
    const spasQuery = Spa.filter(request.qs())
    spasQuery.preload('externalCalendar')

    return response.ok(await spasQuery.exec())
  }

  public async create ({}: HttpContextContract) {}

  public async store ({ request, response }: HttpContextContract) {
    const dto = SpaRessourcePostDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }
    const { body } = await dto.after.customTransform
    const spa = await Spa.create(body)
    if (body.spaImages) {
      await spa.related('spaImages').saveMany(
        await Promise.all(
          body.spaImages.map(async (spaImage) => {
            const s = await spa.related('spaImages').create({
              order: spaImage.order,
            })
            await s.related('image').associate(await Image.findOrFail(spaImage.image))
            return s
          })
        )
      )
      await spa.load('spaImages')
    }
    if (body.services) {
      await spa.related('services').attach(body.services)
    }
    return response.ok(spa)
  }

  public async show ({ response, request }: HttpContextContract) {
    const dto = SpaRessourceGetDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform

    const spa = params.id

    await spa.load('tags')
    await spa.load('services')

    return response.ok(spa)
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({ request, response }: HttpContextContract) {
    const dto = SpaRessourcePatchDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body, params } = await dto.after.customTransform

    const spa = params.id
    spa.merge(body, true)
    if (body.spaImages) {
      await spa.spaImages.map(async (spaImage) => {
        await spaImage.delete()
      })
      await spa.related('spaImages').saveMany(
        await Promise.all(
          body.spaImages.map(async (spaImage) => {
            const s = await spa.related('spaImages').create({
              order: spaImage.order,
            })
            await s.related('image').associate(await Image.findOrFail(spaImage.image))
            return s
          })
        )
      )
    }
    if (body.services) {
      await spa.related('services').detach()
      await spa.related('services').attach(body.services)
    }
  }

  public async destroy ({ response, request }: HttpContextContract) {
    const dto = SpaRessourceDeleteDto.fromRequest(request)
    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform
    const spa = params.id

    await spa.delete()

    return response.ok({ message: 'Spa deleted' })
  }

  public async getImages ({ request }: HttpContextContract) {
    return await SpaImage.query().where('spa_id', request.params().spa).preload('image')
  }

  public async postImages ({ request, response }: HttpContextContract) {
    const dto = SpaImageRessourcePostDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { files, params } = await dto.after.customTransform

    const spa = params.spa
    const images = files.images

    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const uniqueId = uuid()
      const imageO = await Image.create({
        alt: image.clientName,
      })
      const image0Spa = await spa.related('spaImages').create({})
      await image0Spa.related('image').associate(imageO)
      const file = await File.create({
        name: image.clientName,
        extname: image.extname,
        size: image.size,
        uuid: uniqueId,
      })
      await imageO.related('file').associate(file)
      await image.moveToDisk('', {
        name: `${uniqueId}.${image.extname}`,
      })
    }
    return response.ok(spa.spaImages)
  }

  public async sortImages ({ request, response }: HttpContextContract) {
    const dto = SpaImageRessourceSortDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body, params } = await dto.after.customTransform

    const sorted = body.sorted
    const spa = params.spa

    const spaImages = await spa.related('spaImages').query().orderBy('order', 'asc')
    if (!spaImages.every((spaI) => sorted.some((s) => s.id === spaI.id))) {
      return response.badRequest({ message: 'Some images are missing' })
    }

    for (const s of spaImages) {
      const sort = sorted.find((so) => so.id === s.id)!
      s.order = sort.order
      await s.save()
    }

    return response.ok(spaImages)
  }

  public async deleteImage ({ request, response }: HttpContextContract) {
    const dto = SpaImageRessourceDeleteDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { params } = await dto.after.customTransform

    const spa = params.spa
    const spaImage = params.spaImage

    if (spa.id !== spaImage.spaId) {
      return response.badRequest({ message: 'Image does not belong to the spa' })
    }

    await spaImage.delete()
    return response.ok({ message: 'Image deleted' })
  }
}
