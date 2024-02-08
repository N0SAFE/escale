import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Comment from 'App/Models/Comment'
import User from 'App/Models/User'

export default class CommentSeeder extends BaseSeeder {
  public async run () {
    const comments = await Comment.createMany([
      {
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.',
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.',
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.',
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.',
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.',
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.',
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.',
      },
      {
        text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.',
      },
    ])
    await Promise.all(
      comments.map(async (comment) => {
        comment.related('user').associate(await User.firstOrFail())
      })
    )
  }
}
