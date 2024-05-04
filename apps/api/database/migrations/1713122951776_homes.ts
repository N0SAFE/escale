import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'homes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.text('description').notNullable()
      table.integer('video_id').unsigned().references('id').inTable('videos').onDelete('CASCADE')
      table.integer('image_id').unsigned().references('id').inTable('images').onDelete('CASCADE')
      table
        .integer('comment_background_image_id')
        .unsigned()
        .references('id')
        .inTable('images')
        .onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
