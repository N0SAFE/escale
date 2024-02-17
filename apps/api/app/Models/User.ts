import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import Comment from './Comment'

export default class User extends compose(BaseModel, SoftDeletes) {
  @column({ isPrimary: true })
  public id: number

  @column({
    serialize: (value) => value.toLowerCase(),
  })
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @column.dateTime() // @ts-ignore
  public deletedAt?: DateTime | null

  @hasMany(() => Comment)
  public comments: HasMany<typeof Comment>

  @column({
    consume: (value: string | undefined) => {
      if (!value) {
        return []
      }
      try {
        return JSON.parse(value)
      } catch {
        return []
      }
    },
    prepare: (value: string[] | undefined) => {
      if (!value) {
        return JSON.stringify([])
      }
      return JSON.stringify(value)
    },
  })
  public roles: string[]
}
