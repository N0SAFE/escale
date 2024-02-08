import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Spa from 'App/Models/Spa'

export default class SpaSeeder extends BaseSeeder {
  public async run () {
    await Spa.createMany([
      {
        title: 'escale',
        description: 'la description',
        images: [
          'https://so-spa.fr/wp-content/uploads/2022/07/La-Falaise-web-4-1-scaled.jpg',
          'https://so-spa.fr/wp-content/uploads/2022/07/La-Falaise-web-4-1-scaled.jpg',
        ],
      },
    ])
  }
}
