import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

export const roles = {
  admin: {
    label: 'admin',
    description: 'Administrator',
    isAdmin: true,
    isDefault: false,
    isActive: true,
  },
  user: {
    label: 'user',
    description: 'User',
    isAdmin: false,
    isDefault: true,
    isActive: true,
  },
} as const

export default class extends BaseSeeder {
  public async run () {
    await Role.createMany(Object.values(roles))
  }
}
