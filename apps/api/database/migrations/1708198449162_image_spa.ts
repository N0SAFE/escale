import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'image_spa'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.integer('spa_id').unsigned().references('id').inTable('spas').onDelete('CASCADE')
      table.integer('image_id').unsigned().references('id').inTable('images').onDelete('CASCADE')
      table.unique(['spa_id', 'image_id'])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
