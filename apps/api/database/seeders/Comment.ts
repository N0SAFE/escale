import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Comment from 'App/Models/Comment'

export default class extends BaseSeeder {
  public async run () {
    await Comment.createMany([
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
  }
}
