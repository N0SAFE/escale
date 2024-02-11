import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Application from '@ioc:Adonis/Core/Application'
import User from '../User'
import Comment from '../Comment'
import Spa from '../Spa'
import Service from '../Service'
import Tag from '../Tag'
import Availability from '../Availability'
import Faq from '../Faq'

export default class IndexSeeder extends BaseSeeder {
  private async runSeeder (Seeders: typeof BaseSeeder | (typeof BaseSeeder)[]) {
    if (!Array.isArray(Seeders)) {
      Seeders = [Seeders]
    }
    for (const Seeder of Seeders) {
      /**
       * Do not run when not in a environment specified in Seeder
       */
      if (
        !!Seeder.environment &&
        ((!Seeder.environment?.includes('development') && Application.inDev) ||
          (!Seeder.environment?.includes('testing') && Application.inTest) ||
          (!Seeder.environment?.includes('production') && Application.inProduction))
      ) {
        return
      }

      Application.logger.info('running seeder %s', Seeder.name)

      await new Seeder(this.client).run()
    }
  }

  public async run () {
    await this.runSeeder([User, Comment, Spa, Service, Tag, Availability, Faq])
  }
}
