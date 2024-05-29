import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'faqs'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('rank').notNullable().defaultTo(1)
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('rank')
    })
  }
}
