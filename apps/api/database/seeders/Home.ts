import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Comment from 'App/Models/Comment'
import File from 'App/Models/File'
import Home from 'App/Models/Home'
import HomeComment from 'App/Models/HomeComment'
import Image from 'App/Models/Image'
import Video from 'App/Models/Video'
import { faker } from '@faker-js/faker'
import Drive from '@ioc:Adonis/Core/Drive'

export default class HomeSeeder extends BaseSeeder {
  public async run () {
    const video = await Video.query().where('alt', 'like', 'video lescale.mp4').firstOrFail()
    const image = await Image.query().where('alt', 'like', 'main page image').firstOrFail()

    const response = await fetch('https://picsum.photos/1920/1080.jpg')
    const commentBackgroundImageBuffer = Buffer.from(await response.arrayBuffer())

    const file = await File.create({
      name: faker.system.fileName({ extensionCount: 0 }) + '.jpg',
      extname: 'jpg',
      size: commentBackgroundImageBuffer.length,
    })
    const commentBackgroundImage = await Image.create({
      alt: 'avatar',
      fileId: file.id,
    })
    await commentBackgroundImage.load('file')
    await Drive.put(
      `${commentBackgroundImage.directory}/${commentBackgroundImage.serverFileName}`,
      commentBackgroundImageBuffer
    )

    const home = await Home.create({
      description: 'This is a home page',
      videoId: video.id,
      imageId: image.id,
      commentBackgroundImageId: commentBackgroundImage.id,
    })

    const commentCount = (await Comment.query().count('*').firstOrFail()).$extras['count(*)']

    const minCommentNumber = 3
    const maxCommentNumber = 10

    await Promise.all(
      Array.from(
        {
          length: Math.floor(
            Math.random() * (maxCommentNumber - minCommentNumber) + minCommentNumber
          ),
        },
        () => {
          const id = Math.floor(Math.random() * commentCount) + 1
          return HomeComment.create({
            commentId: id,
            homeId: home.id,
          })
        }
      )
    )
  }
}
