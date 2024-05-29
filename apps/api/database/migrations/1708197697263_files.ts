import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'files'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').index().primary()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.uuid('uuid').notNullable().unique()
      table.string('name').notNullable()
      table.string('extname').notNullable()
      table.integer('size').notNullable()
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
