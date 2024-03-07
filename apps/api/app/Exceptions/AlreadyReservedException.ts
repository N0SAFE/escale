import { Exception } from '@adonisjs/core/build/standalone'

/*
|--------------------------------------------------------------------------
| Exception
|--------------------------------------------------------------------------
|
| The Exception class imported from `@adonisjs/core` allows defining
| a status code and error code for every exception.
|
| @example
| new AlreadyReservedException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class AlreadyReservedException extends Exception {
  constructor () {
    super('This date is already reserved', 400, 'E_ALREADY_RESERVED')
  }
}
