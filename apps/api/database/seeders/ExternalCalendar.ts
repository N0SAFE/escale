import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import ExternalCalendar from 'App/Models/ExternalCalendar'

export default class ExternalCalendarSeeder extends BaseSeeder {
  public async run () {
    await ExternalCalendar.createMany([
      {
        spaId: 1,
        airbnbCalendarUrl:
          'https://www.airbnb.com/calendar/ical/1080153087993682153.ics?s=f74db1de5d2746db904dd4d2c9710475&locale=fr',
        bookingCalendarUrl:
          'https://ical.booking.com/v1/export?t=30385c97-6c90-4226-9140-cce18ba1b4c9',
      },
    ])
  }
}
