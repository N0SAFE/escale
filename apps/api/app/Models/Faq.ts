import { DateTime } from 'luxon'
import { beforeCreate, beforeFetch, column } from '@ioc:Adonis/Lucid/Orm'
import AppBaseModel from './AppBaseModel'

export default class Faq extends AppBaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public question: string

  @column()
  public answer: string

  @column()
  public rank: number

  @beforeFetch()
  public static orderFaqByRank(query) {
    query.orderBy('rank', 'asc')
  }

  @beforeCreate()
  public static async setRank(faq: Faq) {
    if (faq.rank) {
      return
    }
    const lastFaq = await Faq.query().orderBy('rank', 'desc').first()
    faq.rank = lastFaq ? lastFaq.rank + 1 : 1
  }
}
