import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'availabilities'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.date('start_at')
      table.date('end_at')
      table.integer('spa_id').unsigned().references('id').inTable('spas').onDelete('CASCADE')
      table.integer('day_price').unsigned()
      table.integer('night_price').unsigned()
      table.integer('journey_price').unsigned()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
