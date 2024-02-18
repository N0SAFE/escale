import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'spas'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string('location').notNullable()
      table.text('google_maps_link').notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
