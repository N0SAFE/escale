import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { spaVideosData } from './data'
import Video from 'App/Models/Video'
import File from 'App/Models/File'
import * as fs from 'fs'
import Drive from '@ioc:Adonis/Core/Drive'

export default class VideoSeeder extends BaseSeeder {
  public async run() {
    await Promise.all(
      spaVideosData.map(async (video) => {
        const videoInstance = await Video.create({
          alt: video.data.alt,
        })
        const sources = await Promise.all(
          video.sources.map(async (source) => {
            const file = await File.create({
              name: source.file.data.name,
              size: fs.statSync(`${__dirname}/assets${source.path}`).size,
              extname: source.file.data.extname,
            })
            return {
              sourceInstance: await videoInstance
                .related('sources')
                .create({
                  fileId: file.id,
                })
                .then(async (sourceInstance) => {
                  await sourceInstance.load('file')
                  return sourceInstance
                }),
              source,
            }
          })
        )
        await sources.map(async ({ source, sourceInstance }) => {
          await Drive.put(
            `${sourceInstance.directory}/${sourceInstance.serverFileName}`,
            fs.readFileSync(`${__dirname}/assets${source.path}`)
          )
        })
        await videoInstance
          .related('sources')
          .saveMany(sources.map((source) => source.sourceInstance))
        return videoInstance
      })
    )
  }
}
