import { BaseCommand } from '@adonisjs/core/build/standalone'

export default class RemoveExpiredDeleted extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'remove:expired:deleted'

  /**
   * Command description is displayed in the "help" output
   */
  public static description = ''

  public static settings = {
    /**
     * Set the following value to true, if you want to load the application
     * before running the command. Don't forget to call `node ace generate:manifest`
     * afterwards.
     */
    loadApp: true,

    /**
     * Set the following value to true, if you want this command to keep running until
     * you manually decide to exit the process. Don't forget to call
     * `node ace generate:manifest` afterwards.
     */
    stayAlive: false,
  }

  public async run () {
    this.logger.info('Hello world!')
    // ! this function as to delete all the users that have been deleted for more than the User.maxTimeSoftDelete
    // ! (same for all the models if  soft delete)
  }
}
