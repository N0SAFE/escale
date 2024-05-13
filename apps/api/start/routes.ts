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
  Route.group(() => {
    Route.post('login', 'AuthController.login')
    Route.post('logout', 'AuthController.logout')
    Route.post('register', 'AuthController.register')
    Route.post('refresh', 'AuthController.refresh')
    Route.get('whoami', 'AuthController.whoami')
    Route.post('try/ical', 'IcalsController.parse')
    Route.get('home', 'HomeController.index')
  })

  Route.group(() => {
    Route.patch('home', 'HomeController.update')
    Route.put('home', 'HomeController.edit')
    Route.delete('spas/:spa/images/:spaImage', 'SpasController.deleteImage')
    Route.post('spas/:spa/images', 'SpasController.postImages')
    Route.post('spas/:spa/images/sort', 'SpasController.sortImages')
    Route.resource('videos', 'VideosController')
      .apiOnly()
      .only(['store', 'update', 'destroy'])
      .useSoftDeletes()
    Route.resource('videos/sources', 'VideoSourcesController')
      .apiOnly()
      .only(['store', 'update', 'destroy'])
      .useSoftDeletes()
    Route.resource('images', 'ImagesController')
      .apiOnly()
      .only(['store', 'update', 'destroy'])
      .useSoftDeletes()
    Route.resource('contact', 'ContactsController')
      .apiOnly()
      .only(['index', 'show', 'update', 'destroy'])
      .useSoftDeletes()
    Route.resource('faqs', 'FaqsController')
      .apiOnly()
      .only(['store', 'update', 'destroy'])
      .useSoftDeletes()
    Route.resource('rules', 'RulesController')
      .apiOnly()
      .only(['store', 'update', 'destroy'])
      .useSoftDeletes()
    Route.resource('users', 'UsersController')
      .apiOnly()
      .only(['index', 'store', 'update', 'destroy', 'show'])
      .useSoftDeletes()
    Route.resource('reservations', 'ReservationsController')
      .apiOnly()
      .only(['store', 'update', 'destroy'])
      .useSoftDeletes()
    Route.resource('availabilities', 'AvailabilitiesController')
      .apiOnly()
      .only(['store', 'update', 'destroy', 'update'])
      .useSoftDeletes()
    Route.resource('spas', 'SpasController')
      .apiOnly()
      .only(['update', 'store', 'destroy'])
      .useSoftDeletes()
    Route.resource('services', 'ServicesController')
      .apiOnly()
      .only(['update', 'store', 'destroy'])
      .useSoftDeletes()
    Route.resource('tags', 'TagsController')
      .apiOnly()
      .only(['store', 'update', 'destroy'])
      .useSoftDeletes()
    Route.resource('comments', 'CommentsController')
      .apiOnly()
      .only(['store', 'update', 'destroy'])
      .useSoftDeletes()
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
    Route.get('reservations/price', 'ReservationsController.price')
    Route.get('spas/:spa/images', 'SpasController.getImages')
    // todo Route.nestedResource('spas/:spa/images', 'SpasController').apiOnly().only(['index']).methodSuffix('images')
    Route.get('attachment/calendar/:id', 'AttachmentsController.calendarById')
    Route.get('reservations/reservable', 'ReservationsController.getReservableDates')
    Route.get(
      'reservations/closest-unreservable',
      'ReservationsController.getClosestUnreservableDates'
    )
    Route.get('reservations/unreservable', 'ReservationsController.getUnreservable')
    Route.get('availabilities/dates', 'AvailabilitiesController.getAvailableDates')
    Route.resource('videos', 'VideosController').apiOnly().only(['index', 'show'])
    Route.resource('videos/sources', 'VideoSourcesController').apiOnly().only(['index', 'show'])
    Route.resource('externalCalendar', 'ExternalCalendarsController')
      .apiOnly()
      .only(['index', 'show'])
    Route.resource('images', 'ImagesController').apiOnly().only(['index', 'show'])
    Route.resource('faqs', 'FaqsController').apiOnly().only(['index', 'show'])
    Route.resource('rules', 'RulesController').apiOnly().only(['index', 'show'])
    Route.resource('contact', 'ContactsController').apiOnly().only(['store'])
    Route.resource('reservations', 'ReservationsController').apiOnly().only(['show', 'index'])
    Route.resource('unavailabilities', 'UnavailabilitiesController').apiOnly().only(['index'])
    Route.resource('availabilities', 'AvailabilitiesController').apiOnly().only(['index', 'show'])
    Route.resource('spas', 'SpasController').apiOnly().only(['index', 'show'])
    Route.resource('services', 'ServicesController').apiOnly().only(['index', 'show'])
    Route.resource('tags', 'TagsController').apiOnly().only(['index', 'show'])
    Route.resource('comments', 'CommentsController').apiOnly().only(['index', 'show'])
  })

  Route.group(() => {
    Route.group(() => {
      Route.get('try/admin', async ({ response }) => {
        return response.ok({ message: 'you are admin' })
      })
    })
  }).middleware(['connected', 'hasRole:admin'])
}).middleware('loadJwtUser')
