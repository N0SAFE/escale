import { BaseModelFilter } from '@ioc:Adonis/Addons/LucidFilter'
import { Relation } from './utils'
import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export type OnFunction = (query: ModelQueryBuilderContract<LucidModel, any>, input: any) => void

export class CustomBaseModelFilter extends BaseModelFilter {
  protected $befores: OnFunction[] = []
  protected $afters: OnFunction[] = []
  public $loadedRelation: Relation

  constructor ($query: any, $input: any) {
    super($query, $input)
  }

  protected addBefore (setup: OnFunction) {
    this.$befores.push(setup)
  }

  protected addAfter (after: OnFunction) {
    this.$afters.push(after)
  }

  public handle () {
    this.$befores.forEach((before) => {
      before(this.$query, this.$input)
    })
    this?.setup?.(this.$query)
    this.$filterByInput()
    this.$afters.forEach((after) => {
      after(this.$query, this.$input)
    })
    return this.$query
  }

  public test = 'test'
  public nogervfd = 'test'
}
