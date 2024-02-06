import { TaskContract } from '@ioc:StouderIO/Scheduler'
import Database from '@ioc:Adonis/Lucid/Database'

export default class OutatedRefreshToken implements TaskContract {
  public readonly name: string = 'OutatedRefreshToken'
  public readonly cron: string = '* * 1 * *'

  public async run (): Promise<void> {
    await Database.from('jwt_tokens').where('refresh_token_expires_at', '<', new Date()).delete()
  }
}
