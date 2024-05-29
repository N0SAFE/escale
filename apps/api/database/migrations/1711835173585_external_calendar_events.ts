import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'external_calendar_events'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.date('start_at')
      table.date('end_at')
      table.enum('from', ['airbnb', 'booking'])
      table.enum('type', ['reserved', 'blocked']).defaultTo('blocked')
      table
        .integer('external_calendar_id')
        .unsigned()
        .references('id')
        .inTable('external_calendars')
        .onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
