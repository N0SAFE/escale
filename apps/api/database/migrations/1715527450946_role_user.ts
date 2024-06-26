import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'role_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE')
      table.integer('role_id').unsigned().references('id').inTable('roles').onDelete('CASCADE')

      table.unique(['user_id', 'role_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
