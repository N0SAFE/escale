import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Spa from 'App/Models/Spa'

export default class extends BaseSeeder {
  public async run () {
    await Spa.createMany([
      {
        title: 'escale',
        description: 'ui',
        images: ['https://picsum.photos/200/300'],
      },
    ])
  }
}
