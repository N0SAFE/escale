import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'availabilities'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('day_price')
      table.dropColumn('night_price')
      table.dropColumn('journey_price')
      table.integer('mon_price_id').unsigned().references('id').inTable('availability_prices')
      table.integer('tue_price_id').unsigned().references('id').inTable('availability_prices')
      table.integer('wed_price_id').unsigned().references('id').inTable('availability_prices')
      table.integer('thu_price_id').unsigned().references('id').inTable('availability_prices')
      table.integer('fri_price_id').unsigned().references('id').inTable('availability_prices')
      table.integer('sat_price_id').unsigned().references('id').inTable('availability_prices')
      table.integer('sun_price_id').unsigned().references('id').inTable('availability_prices')
    })
  }

  public async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('day_price').unsigned()
      table.integer('night_price').unsigned()
      table.integer('journey_price').unsigned()
      table.dropForeign('mon_price_id')
      table.dropForeign('tue_price_id')
      table.dropForeign('wed_price_id')
      table.dropForeign('thu_price_id')
      table.dropForeign('fri_price_id')
      table.dropForeign('sat_price_id')
      table.dropForeign('sun_price_id')
      table.dropColumns(
        'mon_price_id',
        'tue_price_id',
        'wed_price_id',
        'thu_price_id',
        'fri_price_id',
        'sat_price_id',
        'sun_price_id'
      )
    })
  }
}
