import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.string('label').notNullable()
      table.string('description').notNullable()
      table.boolean('is_admin').notNullable().defaultTo(false)
      table.boolean('is_default').notNullable().defaultTo(false)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('deleted_at', { useTz: true }).nullable()
    })

    this.defer(async (db) => {
      await Promise.all([
        db.table(this.tableName).insert({
          id: 1,
          label: 'admin',
          description: 'Administrator',
          is_admin: true,
          is_default: false,
          is_active: true,
        }),
      ])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
