// app/Models/AppBaseModel.ts
import { BaseModel } from '@ioc:Adonis/Lucid/Orm'
import CamelCaseNamingStrategy from 'App/Strategies/CamelCaseNamingStrategy' // 👈 import it
export default class AppBaseModel extends BaseModel {
  public static namingStrategy = new CamelCaseNamingStrategy() // 👈 set as naming strategy
}
