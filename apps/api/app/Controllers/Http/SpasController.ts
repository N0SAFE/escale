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

export default class SpasController {
  public async index ({ response }: HttpContextContract) {
    const spas = await Spa.all()
    spas.forEach(async (spa) => {
      await spa.load('tags')
      await spa.load('services')
    })
    // console.log(spas)
    return response.ok(spas)
  }

  public async create ({}: HttpContextContract) {}

  public async store ({ request, response }: HttpContextContract) {
    const dto = new SpaRessourcePostDto({ body: request.body(), query: request.qs() })

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    const { body } = dto.after

    const spa = await Spa.create(body)

    return response.ok(spa)
  }

  public async show ({ response }: HttpContextContract) {
    const spa = await Spa.query().preload('tags').preload('services').firstOrFail()
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
    console.log(body)
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
  }

  public async destroy ({}: HttpContextContract) {}

  public async getImages ({ request }: HttpContextContract) {
    console.log(request.params())
    return await SpaImage.query().where('spa_id', request.params().spa).preload('image')
  }

  public async postImages ({ request, response }: HttpContextContract) {
    console.log(request.params())
    const dto = SpaImageRessourcePostDto.fromRequest(request)

    const error = await dto.validate()
    if (error.length > 0) {
      return response.badRequest(error)
    }

    console.log(dto)

    const { files, params } = await dto.after.customTransform

    const spa = params.spa
    const images = files.images

    console.log(images)
    for (let i = 0; i < images.length; i++) {
      const image = images[i]
      const uniqueId = uuid()
      console.log('image')
      const imageO = await Image.create({
        alt: image.clientName,
      })
      console.log('imageO')
      const image0Spa = await spa.related('spaImages').create({})
      console.log('image0Spa')
      await image0Spa.related('image').associate(imageO)
      console.log('image0Spa after')
      const file = await File.create({
        name: image.clientName,
        extname: image.extname,
        size: image.size,
        uuid: uniqueId,
      })
      console.log('file')
      await imageO.related('file').associate(file)
      console.log('file after')
      await image.moveToDisk('', {
        name: `${uniqueId}.${image.extname}`,
      })
      console.log('moveToDisk')
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

    console.log(spa)

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
