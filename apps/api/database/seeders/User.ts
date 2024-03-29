import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'

export default class UserSeeder extends BaseSeeder {
  public async run () {
    await User.createMany([
      {
        email: 'admin@admin.com',
        password: 'adminadmin',
        roles: ['admin'],
      },
      {
        email: 'sssebillemathis@gmail.com',
        password: 'SebilleMat3103*',
      },
    ])
  }
}
