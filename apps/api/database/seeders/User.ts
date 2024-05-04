import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { faker } from '@faker-js/faker'
import Image from 'App/Models/Image'
import File from 'App/Models/File'
import Drive from '@ioc:Adonis/Core/Drive'

export default class UserSeeder extends BaseSeeder {
  private rolesList = ['admin']

  public async run () {
    await User.createMany([
      {
        email: 'admin@admin.com',
        password: 'adminadmin',
        roles: ['admin'],
        username: 'admin',
        address: 'admin',
      },
      {
        email: 'sssebillemathis@gmail.com',
        password: 'SebilleMat3103*',
        roles: [],
        username: 'SebilleMathis',
        address: faker.location.streetAddress(),
      },
    ])
    const numOfUsers = 100
    const users: Promise<User>[] = []

    for (let index = 0; index < numOfUsers; index++) {
      let redo = 0
      const maxRedo = 10
      while (redo < maxRedo) {
        const email = faker.internet.email()
        const username = faker.internet.userName()
        if (await User.query().where('email', email).orWhere('username', username).first()) {
          redo++
          continue
        }
        users.push(
          new Promise(async (resolve) => {
            const response = await fetch('https://picsum.photos/200/300.jpg')
            const avatarBuffer = Buffer.from(await response.arrayBuffer())

            const file = await File.create({
              name: faker.system.fileName({ extensionCount: 0 }) + '.jpg',
              extname: 'jpg',
              size: avatarBuffer.length,
            })
            const avatar = await Image.create({
              alt: 'avatar',
              fileId: file.id,
            })
            await avatar.load('file')
            await Drive.put(`${avatar.directory}/${avatar.serverFileName}`, avatarBuffer)
            resolve(
              User.create({
                email: email,
                password: faker.internet.password(),
                roles: Array.from(
                  { length: Math.floor(Math.random() * this.rolesList.length) },
                  () => {
                    return this.rolesList[Math.round(Math.random() * this.rolesList.length)]
                  }
                ),
                username: username,
                address: faker.location.streetAddress(),
                avatarId: avatar.id,
              })
            )
          })
        )
        break
      }
    }
    await Promise.all(users)
  }
}
