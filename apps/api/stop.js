const fs = require('fs')
;(async () => {
  try {
    process.kill(Number(fs.readFileSync(__dirname + '/logs/server.pid').toString()), 'SIGTERM')
    console.log('Killed server')
    fs.unlinkSync(__dirname + '/logs/server.pid')
  } catch (e) {
    console.log('Server already killed')
  }
  console.log('Waiting for server to close')
  await new Promise((resolve) => setTimeout(resolve, 10000))
  console.log('Server closed')
})()
