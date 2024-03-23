import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Service from 'App/Models/Service'
import { serviceImagesData } from './data'
import Image from 'App/Models/Image'
import File from 'App/Models/File'
import Drive from '@ioc:Adonis/Core/Drive'
import fs from 'fs'

export default class ServiceSeeder extends BaseSeeder {
  public async run () {
    const services = await Service.createMany([
      {
        label: 'Checkin/Checkout autonome',
        description: 'description',
      },
      {
        label: 'Ménage professionnel',
        description: 'description',
      },
      {
        label: 'Wifi FIBRE',
        description: 'description',
      },
      {
        label: 'Savon et Gel Douche',
        description: 'description',
      },
      {
        label: 'Literie de qualité',
        description: 'description',
      },
      {
        label: 'Cuisine équipée',
        description: 'description',
      },
      {
        label: 'Serviettes fournies',
        description: 'description',
      },
      {
        label: 'Café/Thé',
        description: 'description',
      },
    ])
    await Promise.all(
      services.map(async (service, index) => {
        const i = serviceImagesData[index]
        const file = await File.create({
          name: i.file.data.name,
          size: fs.statSync(`${__dirname}/assets${i.image}`).size,
          extname: i.file.data.extname,
        })
        const image = await Image.create({
          alt: i.data.alt,
        })
        await image.related('file').associate(file)
        await image.load('file')
        Drive.put(image.path!, fs.readFileSync(`${__dirname}/assets${i.image}`))
        await service.related('image').associate(image)
        await service.related('spa').attach([1])
      })
    )
  }
}
