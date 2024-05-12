import type { ApplicationContract } from '@ioc:Adonis/Core/Application'

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
export default class RouterExtenderProvider {
  constructor (protected app: ApplicationContract) {}

  public register () {
    // Register your own bindings
  }

  public async boot () {
    // All bindings are ready, feel free to use them

    const Route = this.app.container.use('Adonis/Core/Route')

    Route.RouteResource.macro('useSoftDeletes', function () {
      const { resource, controller, resourceName } = this as unknown as {
        resource: string
        controller: string
        resourceName: string
      }
      Route.post(`${resource}/:id/restore`, `${controller}.restore`).as(`${resourceName}.restore`)
      Route.post(`${resource}/:id/force-delete`, `${controller}.forceDelete`).as(
        `${resourceName}.forceDelete`
      )
      Route.get(`${resource}/trashed`, `${controller}.trashed`).as(`${resourceName}.trashed`)
      return this
    })
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
