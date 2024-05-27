import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  HasMany,
  hasMany,
  belongsTo,
  BelongsTo,
  manyToMany,
  ManyToMany,
  beforeFetch,
  beforeFind,
} from '@ioc:Adonis/Lucid/Orm'
import { compose } from '@ioc:Adonis/Core/Helpers'
import { SoftDeletes } from '@ioc:Adonis/Addons/LucidSoftDeletes'
import Comment from './Comment'
import AppBaseModel from './AppBaseModel'
import Image from './Image'
import Role from './Role'
import { Filterable } from '@ioc:Adonis/Addons/LucidFilter'
import UserFilter from './Filters/UserFilter'

export default class User extends compose(AppBaseModel, SoftDeletes, Filterable) {
  public static $filter = () => UserFilter

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
  public comments: HasMany<typeof Comment> = [] as unknown as HasMany<typeof Comment>

  @manyToMany(() => Role)
  public roles: ManyToMany<typeof Role>

  @belongsTo(() => Image, {
    foreignKey: 'avatarId',
  })
  public avatar: BelongsTo<typeof Image>

  @column()
  public avatarId: number

  @column()
  public username: string

  @column()
  public address: string

  // 30 days in milliseconds: after 30 days, the record will be deleted permanently
  public static maxTimeSoftDelete = 1000 * 60 * 60 * 24 * 30

  @beforeFetch()
  @beforeFind()
  public static async preload (query) {
    if (query.hasAggregates) {
      return
    }
    query.preload('roles')
    query.preload('avatar')
  }
}
