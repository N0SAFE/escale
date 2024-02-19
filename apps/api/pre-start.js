const { spawnSync, spawn } = require('child_process')
const ngrok = require('ngrok')
const process = require('process')
const { program } = require('commander')

const command = process.argv.slice(2, -1).join(' ')
const useNgrok = process.argv.slice(-1)[0]

process.on('SIGINT', function () {
  api.kill()
  front.kill()
  process.exit(1)
})

;(async () => {
  const env = await (async () => {
    if (useNgrok === 'true') {
      const ngrockForward = await ngrok.connect()
      console.log('ngrockForward', ngrockForward)
      return { ...process.env, APP_URL: ngrockForward }
    }
    return {
      ...process.env,
    }
  })()
  spawnSync(command, {
    stdio: 'inherit',
    shell: true,
    env: env,
  })
})()
