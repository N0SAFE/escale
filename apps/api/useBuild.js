const { spawnSync } = require('child_process')
const process = require('process')

const command = process.argv.slice(2).join(' ')

process.on('SIGINT', function () {
  api.kill()
  front.kill()
  process.exit(1)
})
;(async () => {
  spawnSync(command, {
    cwd: './build',
    stdio: 'inherit',
    shell: true,
    env: process.env,
  })
})()
