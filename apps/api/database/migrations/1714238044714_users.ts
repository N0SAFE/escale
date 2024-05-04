import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('username').unique().notNullable()
      table.integer('avatar_id').unsigned().references('id').inTable('images').onDelete('CASCADE')
      table.string('address').notNullable()
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('username')
      table.dropColumn('avatar_id')
      table.dropColumn('address')
    })
  }
}
