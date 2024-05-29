import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from 'App/Models/User'
import { faker } from '@faker-js/faker'
import Image from 'App/Models/Image'
import File from 'App/Models/File'
import Drive from '@ioc:Adonis/Core/Drive'
import Role from 'App/Models/Role'

function pickRandomByWeight<T>(
  items: {
    data: T
    weight: number
  }[],
  none?: number
): T | null {
  // Calculate the total weight
  let totalWeight = items.reduce((acc, item) => acc + item.weight, 0) + (none ?? 0)

  // Generate a random number in the range [0, totalWeight)
  let randomNum = Math.random() * totalWeight

  // Find and return the item based on its weight
  for (let i = 0; i < items.length; i++) {
    // Subtract the current item's weight from the random number
    randomNum -= items[i].weight

    // If the random number is less than or equal to zero, return the current item
    if (randomNum <= 0) {
      return items[i].data
    }
  }

  return null
}

const rolesWeights = [
  {
    data: 'admin',
    weight: 1,
  },
]

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const rolesObject = await Role.query()
    const rolesDict = rolesObject.reduce((acc, role) => {
      acc[role.label] = role
      return acc
    }, {}) as {
      [key: string]: Role
    }
    await Promise.all([
      User.create({
        email: 'admin@admin.com',
        password: 'adminadmin',
        username: 'admin',
        address: 'admin',
      }).then((u) => {
        u.related('roles').attach([rolesDict.admin.id])
      }),
      User.create({
        email: 'sssebillemathis@gmail.com',
        password: 'SebilleMat3103*',
        username: 'SebilleMathis',
        address: faker.location.streetAddress(),
      }),
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
            const ro = Array.from(
              new Set(
                Array.from(
                  { length: Math.round(Math.random() * Object.keys(rolesDict).length) },
                  () => {
                    return pickRandomByWeight(rolesWeights, 4)
                  }
                )
              )
            )
              ?.filter((r) => r !== null)
              .map((label) => rolesDict[label as string])
            resolve(
              User.create({
                email: email,
                password: faker.internet.password(),
                username: username,
                address: faker.location.streetAddress(),
                avatarId: avatar.id,
              }).then((u) => {
                u.related('roles').attach(ro.map((r) => r.id))
                return u
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
