import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('test authentification', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('test the login', async ({ client }) => {
    const response = client.post('/login').form({
      email: 'sssebillemathis@gmail.com',
      password: 'test',
    })

    console.log(response)
  })
})
