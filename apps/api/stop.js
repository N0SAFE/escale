const fs = require('fs')

try {
  process.kill(Number(fs.readFileSync(__dirname + '/logs/server.pid').toString()))
  console.log('Killed server')
  fs.unlinkSync(__dirname + '/logs/server.pid')
} catch (e) {
  console.log('Server already killed')
}
