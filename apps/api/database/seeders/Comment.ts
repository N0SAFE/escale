import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Comment from 'App/Models/Comment'
import User from 'App/Models/User'
import { faker } from '@faker-js/faker'
import Spas from 'App/Models/Spa'

export default class CommentSeeder extends BaseSeeder {
  public async run () {
    await Comment.create({
      text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.',
      userId: 1,
      spaId: 1,
    })
    const userCount = (await User.query().count('*').firstOrFail()).$extras['count(*)']
    const spas = await Spas.all()

    const commentNumberPerSpa = 100
    await Promise.all(
      spas.map(async (spa) => {
        return await Promise.all(
          Array.from({ length: commentNumberPerSpa }, () => {
            return new Promise<Comment>(async (resolve) => {
              const comment = await Comment.create({
                text: faker.lorem.sentence(),
                userId: (await User.findOrFail(Math.floor(Math.random() * userCount) + 1)).id,
                spaId: spa.id,
              })
              resolve(comment)
            })
          })
        )
      })
    )
  }
}
