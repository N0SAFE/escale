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
| new ReservationNotChainingException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class ReservationNotChainingException extends Exception {
  constructor() {
    super('This reservation is not chaining', 400, 'E_RESERVATION_NOT_CHAINING')
  }
}
