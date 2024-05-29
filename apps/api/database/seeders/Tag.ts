import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Spa from 'App/Models/Spa'
import Tag from 'App/Models/Tag'

export default class TagSeeder extends BaseSeeder {
  public async run() {
    const tags = await Tag.createMany([
      {
        label: 'chambre',
        icon: 'fa-solid fa-bed',
        number: 1,
      },
      {
        label: 'massage',
        icon: 'fas-spa',
        number: 1,
      },
    ])
    await Promise.all(
      tags.map(async (tag) => {
        await tag.related('spa').associate(await Spa.firstOrFail())
      })
    )
  }
}
