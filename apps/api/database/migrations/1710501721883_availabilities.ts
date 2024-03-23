import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'availabilities'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('day_price')
      table.dropColumn('night_price')
      table.dropColumn('journey_price')
      table
        .integer('mon_price_id')
        .unsigned()
        .references('id')
        .inTable('availability_prices')
        .onDelete('CASCADE')
      table
        .integer('tue_price_id')
        .unsigned()
        .references('id')
        .inTable('availability_prices')
        .onDelete('CASCADE')
      table
        .integer('wed_price_id')
        .unsigned()
        .references('id')
        .inTable('availability_prices')
        .onDelete('CASCADE')
      table
        .integer('thu_price_id')
        .unsigned()
        .references('id')
        .inTable('availability_prices')
        .onDelete('CASCADE')
      table
        .integer('fri_price_id')
        .unsigned()
        .references('id')
        .inTable('availability_prices')
        .onDelete('CASCADE')
      table
        .integer('sat_price_id')
        .unsigned()
        .references('id')
        .inTable('availability_prices')
        .onDelete('CASCADE')
      table
        .integer('sun_price_id')
        .unsigned()
        .references('id')
        .inTable('availability_prices')
        .onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('day_price').unsigned()
      table.integer('night_price').unsigned()
      table.integer('journey_price').unsigned()
    })
  }
}
