import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'external_calendars'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('airbnb_calendar_url').nullable()
      table.string('booking_calendar_url').nullable()
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('airbnb_calendar_url')
      table.dropColumn('booking_calendar_url')
    })
  }
}
