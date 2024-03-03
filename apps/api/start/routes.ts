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
  console.log('checking health')

  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(() => {
  Route.post('checkout-session/spa/journey', 'CheckoutSessionController.journeySpa')
  Route.post('checkout-session/spa', 'CheckoutSessionController.dayOrNightSpa')
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

  Route.group(() => {
    Route.post('spas/:spa/images', 'SpasController.postImages')
    Route.get('spas/:spa/images', 'SpasController.getImages')
    Route.post('spas/:spa/images/sort', 'SpasController.sortImages')
    Route.delete('spas/:spa/images/:spaImage', 'SpasController.deleteImage')
    // todo Route.nestedResource('spas/:spa/images', 'SpasController').apiOnly().only(['index']).methodSuffix('images')
    Route.get('attachment/image/:id', 'AttachmentsController.imageById')
    Route.resource('images', 'ImagesController').apiOnly().only(['index', 'show', 'store', 'update'])
    Route.resource('faqs', 'FaqsController').apiOnly().only(['index', 'show'])
    Route.resource('rules', 'RulesController').apiOnly().only(['index', 'show'])
    Route.resource('contact', 'ContactsController').apiOnly().only(['store'])
    Route.resource('users', 'UsersController').apiOnly().only(['show'])
    Route.get('users/me', 'UsersController.me')
    Route.get('reservations/available-dates', 'ReservationsController.availableDates')
    Route.get('reservations/price', 'ReservationsController.price')
    Route.get('reservations/journey-price', 'ReservationsController.journeyPrice')
    Route.resource('reservations', 'ReservationsController').apiOnly().only(['show'])
    Route.resource('availabilities', 'AvailabilitiesController').apiOnly().only(['index', 'show'])
    Route.resource('spas', 'SpasController').apiOnly().only(['index', 'show', 'update'])
    Route.resource('services', 'ServicesController').apiOnly().only(['index', 'show', 'update'])
    Route.resource('tags', 'TagsController').apiOnly().only(['index', 'show'])
    Route.resource('comments', 'CommentsController').apiOnly().only(['index', 'show'])
  })

  Route.group(() => {
    Route.group(() => {
      // route for admin user only
    })
  }).middleware('connected')
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
