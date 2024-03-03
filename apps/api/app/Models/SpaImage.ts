import { DateTime } from 'luxon'
import {
  BaseModel,
  BelongsTo,
  beforeCreate,
  beforeFetch,
  belongsTo,
  column,
} from '@ioc:Adonis/Lucid/Orm'
import Spa from './Spa'
import Image from './Image'

export default class SpaImage extends BaseModel {
  public static table = 'spa_image'

  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public spaId: number

  @belongsTo(() => Spa)
  public spa: BelongsTo<typeof Spa>

  @column()
  public imageId: number | null = null

  @belongsTo(() => Image)
  public image: BelongsTo<typeof Image>

  @column()
  public order: number

  // @beforeCreate()
  // @beforeUpdate()
  // public static async reorder (imageSpa: ImageSpa) {
  //   // if (imageSpa.$dirty.order) {
  //   //   const images = await ImageSpa.query().where('spa_id', imageSpa.spaId).orderBy('order', 'asc')
  //   //   for (let i = 0; i < images.length; i++) {
  //   //     images[i].order = i
  //   //     await images[i].save()
  //   //   }
  //   // }
  //   // const images = await ImageSpa.query().where('spa_id', imageSpa.spaId).orderBy('order', 'asc')
  //   // console.log(images)
  //   // for (let i = 0; i < images.length; i++) {
  //   //   images[i].order = i
  //   //   await images[i].save()
  //   // }
  // }

  @beforeFetch()
  public static async preloadImage (query) {
    query.orderBy('order', 'asc').preload('image')
  }
}
