import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import File from 'App/Models/File'
import Spa from 'App/Models/Spa'
import fs from 'fs'
import { spaImagesData } from './data'
import Drive from '@ioc:Adonis/Core/Drive'
import Image from 'App/Models/Image'

export default class SpaSeeder extends BaseSeeder {
  public async run () {
    const spa = await Spa.create({
      title: 'l\'escale',
      description: `Ce logement affiche un style résolument unique. Plongez vous au cœur de cette suite exceptionnelle et profitez pleinement de son jacuzzi. <br>
      Situé à 1h de Paris, 5 minutes de l'aéroport de Beauvais-Tillé et de la A16, faites une escale dans notre magnifique suite. <br>
      Plusieurs restaurants desservant la Suite via Uber eats et autres plateformes, savourez un moment de détente devant Netflix, Amazon Prime ainsi que Deezer. Et ce, depuis votre lit ou depuis votre jacuzzi grâce à notre TV rotative !`,
      location: '19 rue Aimé Besnard Maison n°5 60510 Therdonne',
      googleMapsLink:
        'https://www.google.fr/maps/search/19+rue+Aim%C3%A9+Besnard+Maison+n%C2%B05+60510+Therdonne/@49.4246179,2.1335643,19z/data=!3m1!4b1?entry=ttu',
    })

    for (let index = 0; index < spaImagesData.length; index++) {
      const i = spaImagesData[index]

      const image = await Image.create({
        alt: i.data.alt,
      })
      const spaImage = await spa.related('spaImages').create({
        order: index + 1,
      })
      await spaImage.related('image').associate(image)
      const file = await File.create({
        name: i.file.data.name,
        size: fs.statSync(`${__dirname}/assets${i.image}`).size,
        extname: i.file.data.extname,
      })
      await image.related('file').associate(file)
      await image.load('file')
      Drive.put(
        image.path!,
        fs.readFileSync(`${__dirname}/assets${i.image}`)
      )
    }

    // images.forEach(async (i, index) => {
    //   const id = uuid()
    //   const image = await Image.create({
    //     alt: i.data.alt,
    //   })
    //   console.log('image')
    //   const imageSpa = await spa.related('images').create({order: index})
    //   console.log('imageSpa')
    //   await imageSpa.related('image').associate(image)
    //   console.log('imageSpa after')
    //   // const image = await spa.related('images').create({
    //   //   alt: i.data.alt,
    //   // }).then((image) => {
    //   //   image.$dirty.order = index
    //   //   image.save()
    //   //   return image
    //   // })
    //   // spa.related('images').pivotQuery().where('image_id', image.id).update({ order: index })
    //   const file = await File.create({
    //     name: i.file.data.name,
    //     size: i.file.data.size,
    //     extname: i.file.data.extname,
    //     uuid: id,
    //   })
    //   console.log('file')
    //   await image.related('file').associate(file)
    //   console.log('file after')
    //   Drive.put(id + '.' + i.file.data.extname, fs.readFileSync(`${__dirname}/assets${i.image}`))
    // })
  }
}
