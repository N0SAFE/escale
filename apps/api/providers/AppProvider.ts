import type { ApplicationContract } from '@ioc:Adonis/Core/Application'
import Env from '@ioc:Adonis/Core/Env'
import { config } from 'dotenv'
config()
const changedAppUrl = process.env.APP_URL // if a APP_URL is pass in env to the process use this one for the app_url

export default class AppProvider {
  constructor (protected app: ApplicationContract) {}

  public register () {
    if (changedAppUrl) {
      Env.set('APP_URL', changedAppUrl)
    }
    // Register your own bindings
  }

  public async boot () {
    // IoC container is ready
  }

  public async ready () {
    // App is ready
  }

  public async shutdown () {
    // Cleanup, since app is going down
  }
}
