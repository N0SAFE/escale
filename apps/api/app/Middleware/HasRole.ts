import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HasRole {
  public async handle (
    { auth, response }: HttpContextContract,
    next: () => Promise<void>,
    roles: string[]
  ) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      const user = await auth.use('jwt').authenticate()
      if (!user) {
        return response.unauthorized({ error: 'Unauthorized' })
      }
      if (
        !user.roles.some((role) =>
          roles.map((r) => r.toLowerCase()).includes(role.label.toLowerCase())
        )
      ) {
        return response.unauthorized({ error: 'Unauthorized' })
      }
    } catch (e) {
      return response.unauthorized({ error: 'Unauthorized' })
    }

    await next()
  }
}
