import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'contacts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string('name').notNullable()
      table.string('email').notNullable()
      table.string('subject').notNullable()
      table.string('message').notNullable()
      table.boolean('read').notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
