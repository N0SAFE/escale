export default {
  creation: {
    ['#link']: 'https://docs.adonisjs.com/guides/database/introduction',
    install: {
      item: '#',
      cmd: 'npm install @adonisjs/cli',
      description: 'install adonisjs cli',
      actions: ['install adonisjs cli'],
    },
    configure: {
      item: '#',
      cmd: 'node ace configure',
      description: 'configure adonisjs cli',
      actions: ['configure adonisjs cli'],
    },
  },
  migration: {
    create: {
      item: '#',
      cmd: 'node ace make:migration ${var}',
      description: 'create a migration with a given name',
      actions: ['create migration file on database/migrations/${#id}_${var}.ts'],
      options: [
        {
          alias: [],
          label: 'connection',
          description: 'define the connection to use',
          type: 'string',
          required: false,
          default: 'default',
          examples: ['connection=pg'],
        },
      ],
    },
    ['run:up']: {
      item: '#',
      cmd: 'node ace migration:run',
      description: 'run all pending migrations',
      actions: ['run all pending migrations in the database'],
    },
    ['run:down']: {
      item: '#',
      cmd: 'node ace migration:rollback',
      description: 'rollback last migration',
      actions: ['rollback last migration in the database'],
      options: [
        {
          alias: [],
          label: 'batch',
          description: 'define the batch number to rollback',
          type: 'number',
          required: false,
          default: 0,
          examples: [
            {
              value: 'batch=0',
              description: 'rollback all the migrations',
              alias: [{ type: 'command', value: 'node ace migration:reset' }],
            },
            { value: 'batch=1', description: 'rollback to the first migration' },
            { value: 'batch=10', description: 'rollback to the 10th migration' },
          ],
        },
      ],
    },
    refresh: {
      item: '#',
      cmd: 'node ace migration:refresh',
      description: 'rollback all migrations and run them all again',
      actions: ['rollback all migrations and run them all again in the database'],
      options: [
        {
          label: 'seed',
          description: 'run the seeder with all of this',
          actions: [
            'run the seeder with all after the downgrade and the upgrade of the migrations',
          ],
          type: 'boolean',
          required: false,
          default: false,
        },
      ],
    },
    fresh: {
      item: '#',
      cmd: 'node ace migration:fresh',
      description: 'drop all tables and re-run all migrations',
      actions: ['drop all tables and re-run all migrations in the database'],
      options: [
        {
          label: 'seed',
          description: 'run the seeder with all of this',
          actions: ['run the seeder with all after the drop and the upgrade of the migrations'],
          type: 'boolean',
          required: false,
          default: false,
        },
      ],
    },
  },
  seeder: {
    run: {
      item: '#',
      cmd: 'node ace db:seed',
      description: 'run all seeders',
      actions: ['run all seeders in the database'],
      options: [
        {
          alias: [],
          label: 'files',
          description: 'define the seeders to run',
          type: 'array',
          required: false,
          default: [],
          examples: ['files=UsersSeeder'],
          behavior: { allowMultiple: true },
        },
      ],
    },
  },
}
