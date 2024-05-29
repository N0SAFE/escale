import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import { LucidModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

/*
|--------------------------------------------------------------------------
| Provider
|--------------------------------------------------------------------------
|
| Your application is not ready when this file is loaded by the framework.
| Hence, the top level imports relying on the IoC container will not work.
| You must import them inside the life-cycle methods defined inside
| the provider class.
|
| @example:
|
| public async ready () {
|   const Database = this.app.container.resolveBinding('Adonis/Lucid/Database')
|   const Event = this.app.container.resolveBinding('Adonis/Core/Event')
|   Event.on('db:query', Database.prettyPrint)
| }
|
*/
export default class ModelQueryBuilderPreloadProvider {
  constructor(protected app: ApplicationContract) {}

  public register() {
    // Register your own bindings
  }

  public async boot() {
    this.app.container.withBindings(['Adonis/Lucid/Database'], ({ ModelQueryBuilder }) => {
      ModelQueryBuilder.macro(
        'onPreloadedChain',
        function (relation, callback): ModelQueryBuilderContract<LucidModel> {
          let good = false
          this.ifPreloaded(relation, function (query) {
            if (good) {
              return
            }
            callback(query)
            good = true
          })
          this.whenPreloadedChain(relation, function (query) {
            if (good) {
              return
            }
            callback(query)
            good = true
          })
          return this
        }
      )
      ModelQueryBuilder.macro(
        'whenChainPreloaded',
        function (relation, callback): ModelQueryBuilderContract<LucidModel> {
          const self = this as any
          if (self.preloader.preloads?.[relation]) {
            self.preloadChain(relation, callback)
          } else {
            self.onPreloadChainTrigger(relation, callback)
          }
          return this
        }
      )
      ModelQueryBuilder.macro('isPreloaded', function (relation): boolean {
        const self = this as any
        return self.preloader.preloads?.[relation] !== undefined
      })
      ModelQueryBuilder.macro(
        'ifPreloaded',
        function (relation, callback): ModelQueryBuilderContract<LucidModel> {
          const self = this as any
          if (self.preloader.preloads?.[relation]) {
            this.preloadChain(relation, callback)
          }
          return this
        }
      )
      ModelQueryBuilder.macro(
        'preloadChain',
        function (relation, callback, onChildPreloadEvents): ModelQueryBuilderContract<LucidModel> {
          const self = this as any
          if (!self.preloader.preloadsTrigger) {
            self.preloader.preloadsTrigger = {}
          }
          const preloadTrigger = self.preloader.preloadsTrigger[relation]
          let childCallback = onChildPreloadEvents || (() => {})
          const triggerChildPreloadEvent = (query) => {
            childCallback(query)
          }
          if (self?.preloader?.preloads?.[relation]) {
            if (self.preloader.preloads[relation].callback) {
              const lastCallback = self.preloader.preloads[relation].callback
              if (preloadTrigger) {
                this.preload(relation, (query) => {
                  preloadTrigger(query)
                  callback?.(query, {
                    isParent: false,
                  })
                  lastCallback(query)
                })
                delete self.preloader.preloadsTrigger[relation]
              } else {
                this.preload(relation, (query) => {
                  callback?.(query, {
                    isParent: false,
                  })
                  lastCallback(query)
                })
              }
              return this
            }
          }
          if (preloadTrigger) {
            this.preload(relation, function (query) {
              preloadTrigger(query)
              callback?.(query, {
                isParent: true,
              })
            })
            delete self.preloader.preloadsTrigger[relation]
          } else {
            this.preload(relation, function (query) {
              callback?.(query, {
                isParent: true,
              })
            })
          }
          self.preloader.preloadsTrigger[relation] = triggerChildPreloadEvent
          return this
        }
      )
      ModelQueryBuilder.macro(
        'whenPreloadedChain',
        function (relation, callback): ModelQueryBuilderContract<any, any> {
          const self = this as any
          if (!self.preloader.preloadsTrigger) {
            self.preloader.preloadsTrigger = {}
          }
          if (self?.preloader?.preloadsTrigger?.[relation]) {
            const lastParentTrigger = self.preloader.preloadsTrigger[relation]

            self.preloader.preloadsTrigger[relation] = function (query) {
              callback(query)
              lastParentTrigger()
            }
          } else {
            self.preloader.preloadsTrigger[relation] = function (query) {
              callback(query)
            }
          }
          return this
        }
      )
    })
    // All bindings are ready, feel free to use them
  }

  public async ready() {
    // App is ready
  }

  public async shutdown() {
    // Cleanup, since app is going down
  }
}
