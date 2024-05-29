import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('image')
      table.integer('image_id').unsigned().references('id').inTable('images').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['image_id'])
      table.dropColumn('image_id')
      table.string('image').notNullable()
    })
  }
}
