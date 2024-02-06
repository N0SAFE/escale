import { TaskContract } from '@ioc:StouderIO/Scheduler'

export default class MyFirstTask implements TaskContract {
  public readonly name: string = 'MyFirstTask'
  public readonly cron: string = '* * * * *'

  public async run (): Promise<void> {}
}
