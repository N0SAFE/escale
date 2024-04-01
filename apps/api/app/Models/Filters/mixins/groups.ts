import type { NormalizeConstructor } from '@ioc:Adonis/Core/Helpers'
import { Relation, preloadFromGroups } from './utils'
import { CustomBaseModelFilter } from './CustomBaseModelFilter'
import { Exception } from '@adonisjs/core/build/standalone'

// ! todo implment the allowedProperty
// todo no groups can be used in the filter if the property is not allowed
// todo in the model you can define a $defaultGroups that will be used in addition to the groups given in the filter
export default function groupsFilterMixin<
  T extends NormalizeConstructor<typeof CustomBaseModelFilter>
> (Base: T) {
  return class GroupsFilterMixin extends Base {
    public $loadedRelation: Relation

    constructor (...args: any[]) {
      super(...args)
      if (!this.$afters || !this.$befores) {
        throw new Exception(
          'this filter is not a mixin for the CustomBaseModelFilter',
          500,
          'E_RUNTIME_EXCEPTION'
        )
      }
      this.addBefore((_, input) => {
        let value = input.groups
        if (!Array.isArray(value)) {
          if (value) {
            value = [value]
          } else {
            value = []
          }
        }
        const { relation, launchPreload } = preloadFromGroups(value, this.$query)
        this.$loadedRelation = relation
        this.addAfter(() => {
          //   console.log('launchPreload')
          launchPreload()
        })
      })
    }
  }
}
