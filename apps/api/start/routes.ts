/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'

// check db connection
Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(() => {
  // Route.post('checkout-session/spa/journey', 'CheckoutSessionController.journeySpa')
  Route.post('checkout-session/spa', 'CheckoutSessionController.spa')
})

Route.group(() => {
  Route.post('webhook/stripe', 'WebhooksController.stripe')
})

Route.group(() => {
  Route.post('login', 'AuthController.login')
  Route.post('logout', 'AuthController.logout')
  Route.post('register', 'AuthController.register')
  Route.post('refresh', 'AuthController.refresh')
  Route.get('whoami', 'AuthController.whoami')
  Route.post('try/ical', 'IcalsController.parse')

  Route.group(() => {
    Route.delete('spas/:spa/images/:spaImage', 'SpasController.deleteImage')
    Route.resource('images', 'ImagesController').apiOnly().only(['store', 'update', 'destroy'])
    Route.resource('contact', 'ContactsController')
      .apiOnly()
      .only(['index', 'show', 'update', 'destroy'])
    Route.resource('faqs', 'FaqsController').apiOnly().only(['store', 'update', 'destroy'])
    Route.resource('rules', 'RulesController').apiOnly().only(['store', 'update', 'destroy'])
    Route.resource('users', 'UsersController')
      .apiOnly()
      .only(['index', 'store', 'update', 'destroy'])
    Route.resource('reservations', 'ReservationsController')
      .apiOnly()
      .only(['store', 'update', 'destroy'])
    Route.resource('availabilities', 'AvailabilitiesController')
      .apiOnly()
      .only(['store', 'update', 'destroy', 'update'])
    Route.resource('spas', 'SpasController').apiOnly().only(['update', 'store', 'destroy'])
    Route.resource('services', 'ServicesController').apiOnly().only(['update', 'store', 'destroy'])
    Route.resource('tags', 'TagsController').apiOnly().only(['store', 'update', 'destroy'])
    Route.resource('comments', 'CommentsController').apiOnly().only(['store', 'update', 'destroy'])
  }).middleware(['connected', 'hasRole:admin'])

  Route.group(() => {
    Route.get('users/me', 'UsersController.me')
  }).middleware('connected')

  Route.group(() => {
    Route.get(
      'external-calendars/:externalCalendar/events/blocked',
      'ExternalEventsController.getBlockedDates'
    )
    Route.get(
      'external-calendars/:externalCalendar/events/reserved',
      'ExternalEventsController.getReservedDates'
    )
    Route.resource('externalCalendar', 'ExternalCalendarsController')
      .apiOnly()
      .only(['index', 'show'])
    Route.get('reservations/price', 'ReservationsController.price')
    Route.post('spas/:spa/images', 'SpasController.postImages')
    Route.get('spas/:spa/images', 'SpasController.getImages')
    Route.post('spas/:spa/images/sort', 'SpasController.sortImages')
    // todo Route.nestedResource('spas/:spa/images', 'SpasController').apiOnly().only(['index']).methodSuffix('images')
    Route.get('attachment/image/:id', 'AttachmentsController.imageById')
    Route.get('attachment/calendar/:id', 'AttachmentsController.calendarById')
    Route.resource('images', 'ImagesController').apiOnly().only(['index', 'show'])
    Route.resource('faqs', 'FaqsController').apiOnly().only(['index', 'show'])
    Route.resource('rules', 'RulesController').apiOnly().only(['index', 'show'])
    Route.resource('contact', 'ContactsController').apiOnly().only(['store'])
    Route.resource('users', 'UsersController').apiOnly().only(['show'])
    Route.get('reservations/reservable', 'ReservationsController.getReservableDates')
    Route.get(
      'reservations/closest-unreservable',
      'ReservationsController.getClosestUnreservableDates'
    )
    Route.get('reservations/unreservable', 'ReservationsController.getUnreservable')
    Route.resource('reservations', 'ReservationsController').apiOnly().only(['show', 'index'])
    Route.resource('unavailabilities', 'UnavailabilitiesController').apiOnly().only(['index'])
    Route.get('availabilities/dates', 'AvailabilitiesController.getAvailableDates')
    Route.resource('availabilities', 'AvailabilitiesController').apiOnly().only(['index', 'show'])
    Route.resource('spas', 'SpasController').apiOnly().only(['index', 'show'])
    Route.resource('services', 'ServicesController').apiOnly().only(['index', 'show'])
    Route.resource('tags', 'TagsController').apiOnly().only(['index', 'show'])
    Route.resource('comments', 'CommentsController').apiOnly().only(['index', 'show'])
  })

  Route.group(() => {
    Route.group(() => {
      Route.get('try/admin', async ({ response, auth }) => {
        console.log('try admin')
        console.log(auth.use('jwt').user)
        return response.ok({ message: 'you are admin' })
      })
    })
  }).middleware(['connected', 'hasRole:admin'])
}).middleware('loadJwtUser')

// Route.group(() => {
//   Route.post('login', 'AuthController.login')
//   Route.post('logout', 'AuthController.logout')
//   Route.post('register', 'AuthController.register')
//   Route.post('refresh', 'AuthController.refresh')
//   Route.get('whoami', 'AuthController.whoami')
// }).middleware(async ({ auth, request, response }, next) => {
//   if (!request.headers().authorization && request.cookie('access_token')) {
//     request.headers().authorization = `Bearer ${request.cookie('access_token')}`
//   }
//   Env.get('NODE_ENV') === 'development' && Logger.info('authenticating')
//   try {
//     await auth.use('jwt').authenticate()
//   } catch (e) {
//     if (request.cookie('refresh_token')) {
//       const refreshToken = request.cookie('refresh_token')
//       try {
//         const jwt = await auth.use('jwt').loginViaRefreshToken(refreshToken)
//         response.cookie('access_token', jwt.accessToken, {
//           httpOnly: true,
//           path: '/',
//           sameSite: 'none',
//           secure: true,
//         })
//         response.cookie('refresh_token', jwt.refreshToken, {
//           httpOnly: true,
//           path: '/',
//           sameSite: 'none',
//           secure: true,
//         })
//       } catch (e) {}
//     }
//   }
//   return await next()
// })

// async ({ auth, response, request }: HttpContextContract, next) => {
//   if (!request.headers().authorization && request.cookie('access_token')) {
//     request.headers().authorization = `Bearer ${request.cookie('access_token')}`
//   }
//
//   Env.get('NODE_ENV') === 'development' && Logger.info('authenticating')
//   try {
//     await auth.use('jwt').authenticate()
//   } catch (e) {
//     Env.get('NODE_ENV') === 'development' && Logger.error('auth failed')
//     Env.get('NODE_ENV') === 'development' && Logger.error(e)
//     if (Env.get('NODE_ENV') === 'development') {
//       if (!request.cookie('refresh_token')) {
//         return response.unauthorized({ error: 401, message: 'invalid credentials' })
//       }
//       Logger.info('refreshing token')
//       const refreshToken = request.cookie('refresh_token')
//       try {
//         const jwt = await auth.use('jwt').loginViaRefreshToken(refreshToken)
//         response.cookie('access_token', jwt.accessToken, {
//           httpOnly: true,
//           path: '/',
//           sameSite: 'none',
//           secure: true,
//         })
//         response.cookie('refresh_token', jwt.refreshToken, {
//           httpOnly: true,
//           path: '/',
//           sameSite: 'none',
//           secure: true,
//         })
//       } catch (e) {
//         return response.unauthorized({ error: 401, message: 'invalid credentials' })
//       }
//     } else {
//       return response.unauthorized({ error: 401, message: 'invalid credentials' })
//     }
//   }
//   return await next()
// }
