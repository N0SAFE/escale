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
| new DateNotAvailableException('message', 500, 'E_RUNTIME_EXCEPTION')
|
*/
export default class DateNotAvailableException extends Exception {
  constructor () {
    super('This date is not available', 400, 'E_DATE_NOT_AVAILABLE')
  }
}
