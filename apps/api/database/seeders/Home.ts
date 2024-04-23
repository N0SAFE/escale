import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Home from 'App/Models/Home'
import Image from 'App/Models/Image'
import Video from 'App/Models/Video'

export default class HomeSeeder extends BaseSeeder {
  public async run () {
    const video = await Video.query().where('alt', 'like', 'video lescale.mp4').firstOrFail()
    const image = await Image.query().where('alt', 'like', 'main page image').firstOrFail()
    await Home.create({
      description: 'This is a home page',
      videoId: video.id,
      imageId: image.id,
    })
  }
}
