const { spawnSync, spawn } = require('child_process')
const ngrok = require('ngrok')
const process = require('process')

const command = process.argv.slice(2).join(' ')

process.on('SIGINT', function () {
  api.kill()
  front.kill()
  process.exit(1)
})

;(async () => {
  const env = await (async () => {
    const ngrockForward = await ngrok.connect()
    console.log('ngrockForward', ngrockForward)
    return { ...process.env, APP_URL: ngrockForward }
  })()
  spawnSync(command.replace('$$ngrok-url', env.ngrockForward), {
    stdio: 'inherit',
    shell: true,
    env: env,
  })
  ngrok.kill()
})()
