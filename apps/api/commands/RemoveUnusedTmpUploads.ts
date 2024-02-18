import { BaseCommand } from '@adonisjs/core/build/standalone'
import fs from 'fs'

export default class RemoveUnusedTmpUploads extends BaseCommand {
  /**
   * Command name is used to run the command
   */
  public static commandName = 'remove:unused:tmp:uploads'

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
    const File = (await import('App/Models/File')).default
    await Promise.all(fs.readdirSync(this.application.tmpPath('uploads')).map(async (file) => {
      const f = await File.query().where('uuid', file).first()
      if (!f) {
        fs.unlinkSync(this.application.tmpPath('uploads', file))
        this.logger.info(`Removed ${file}`)
      }
    }))
  }
}
