import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'booked_dates'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('date', { useTz: true })
      table
        .integer('reservation_id')
        .unsigned()
        .references('id')
        .inTable('reservations')
        .onDelete('CASCADE')
      table.integer('type_reservation_id').unsigned().notNullable()
      table.unique(['date', 'type'])
      table.string('type').notNullable()
    })

    // i want to create a trigger on the table reservations that check
    // for the dates that as been booked and add it to the booked_dates table
    await this.raw(
      `
      CREATE TRIGGER check_booked_dates_on_night_reservations
      AFTER INSERT ON night_reservations
      FOR EACH ROW
      BEGIN
        INSERT INTO booked_dates (date, type, reservation_id, type_reservation_id) VALUES (NEW.date, 'night', NEW.reservation_id, NEW.id);
      END;
      `
    )
    await this.raw(
      `
      CREATE TRIGGER check_booked_dates_on_day_reservations
      AFTER INSERT ON day_reservations
      FOR EACH ROW
      BEGIN
        INSERT INTO booked_dates (date, type, reservation_id, type_reservation_id) VALUES (NEW.date, 'day', NEW.reservation_id, NEW.id);
      END;
      `
    )
    await this.raw(
      `
      CREATE TRIGGER check_booked_dates_on_journey_reservations
      AFTER INSERT ON journey_reservations
      FOR EACH ROW
      BEGIN
        SET @current_date = NEW.start_at;

        WHILE @current_date <= NEW.end_at DO
          INSERT INTO booked_dates (date, type, reservation_id, type_reservation_id) VALUES (@current_date, 'journey', NEW.reservation_id, NEW.id);
          SET @current_date = DATE_ADD(@current_date, INTERVAL 1 DAY);
        END WHILE;
      END;
      `
    )
    // do the same but for the update and delete
    await this.raw(
      `
      CREATE TRIGGER check_booked_dates_on_night_reservations_update
      AFTER UPDATE ON night_reservations
      FOR EACH ROW
      BEGIN
        UPDATE booked_dates SET date = NEW.date WHERE date = OLD.date AND type = 'night';
      END;
      `
    )
    await this.raw(
      `
      CREATE TRIGGER check_booked_dates_on_day_reservations_update
      AFTER UPDATE ON day_reservations
      FOR EACH ROW
      BEGIN
        UPDATE booked_dates SET date = NEW.date WHERE date = OLD.date AND type = 'day';
      END;
      `
    )
    await this.raw(
      `
      CREATE TRIGGER check_booked_dates_on_journey_reservations_update
      AFTER UPDATE ON journey_reservations
      FOR EACH ROW
      BEGIN
        SET @current_date = OLD.start_at;

        WHILE @current_date <= OLD.end_at DO
          DELETE FROM booked_dates WHERE date = @current_date AND type = 'journey';
          SET @current_date = DATE_ADD(@current_date, INTERVAL 1 DAY);
        END WHILE;

        SET @new_date = NEW.start_at;

        WHILE @new_date <= NEW.end_at DO
          INSERT INTO booked_dates (date, type, reservation_id, type_reservation_id) VALUES (@new_date, 'journey', NEW.reservation_id, NEW.id);
          SET @new_date = DATE_ADD(@new_date, INTERVAL 1 DAY);
        END WHILE;
      END;
      `
    )
    await this.raw(
      `
      CREATE TRIGGER check_booked_dates_on_night_reservations_delete
      AFTER DELETE ON night_reservations
      FOR EACH ROW
      BEGIN
        DELETE FROM booked_dates WHERE date = OLD.date AND type = 'night';
      END;
      `
    )
    await this.raw(
      `
      CREATE TRIGGER check_booked_dates_on_day_reservations_delete
      AFTER DELETE ON day_reservations
      FOR EACH ROW
      BEGIN
        DELETE FROM booked_dates WHERE date = OLD.date AND type = 'day';
      END;
      `
    )
    await this.raw(
      `
      CREATE TRIGGER check_booked_dates_on_journey_reservations_delete
      AFTER DELETE ON journey_reservations
      FOR EACH ROW
      BEGIN
        SET @current_date = OLD.start_at;

        WHILE @current_date <= OLD.end_at DO
          DELETE FROM booked_dates WHERE date = @current_date AND type = 'journey';
          SET @current_date = DATE_ADD(@current_date, INTERVAL 1 DAY);
        END WHILE;
      END;
      `
    )
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
