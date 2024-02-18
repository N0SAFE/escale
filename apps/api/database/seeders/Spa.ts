import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import File from 'App/Models/File'
import Spa from 'App/Models/Spa'
import { v4 as uuid } from 'uuid'
import fs from 'fs'
import Application from '@ioc:Adonis/Core/Application'

export default class SpaSeeder extends BaseSeeder {
  public async run () {
    const spa = await Spa.create({
      title: 'l\'escale',
      description: `Ce logement affiche un style résolument unique. Plongez vous au cœur de cette suite exceptionnelle et profitez pleinement de son jacuzzi. <br>
      Situé à 1h de Paris, 5 minutes de l'aéroport de Beauvais-Tillé et de la A16, faites une escale dans notre magnifique suite. <br>
      Plusieurs restaurants desservant la Suite via Uber eats et autres plateformes, savourez un moment de détente devant Netflix, Amazon Prime ainsi que Deezer. Et ce, depuis votre lit ou depuis votre jacuzzi grâce à notre TV rotative !`,
      location: '19 rue Aimé Besnard Maison n°5 60510 Therdonne',
      googleMapsLink: 'https://www.google.fr/maps/search/19+rue+Aim%C3%A9+Besnard+Maison+n%C2%B05+60510+Therdonne/@49.4246179,2.1335643,19z/data=!3m1!4b1?entry=ttu',
    })

    const images = JSON.parse(fs.readFileSync(__dirname + '/SpaImage.json').toString())

    images.forEach(async (i) => {
      const id = uuid()
      const image = await spa.related('images').create({
        alt: i.data.alt,
      })
      const file = await File.create({
        name: i.file.data.name,
        size: i.file.data.size,
        uuid: id,
      })
      await image.related('file').associate(file)
      fs.copyFileSync(`${__dirname}/../../../../notes/all/${i.image}`, Application.tmpPath('uploads', id))
    })
  }
}
