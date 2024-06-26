// copy .env.production to ./build/.env
const fs = require('fs')

if (!fs.existsSync('./.env.production')) {
  console.error('.env.production file not found')
  process.exit(1)
}
console.log('Copying .env.production to ./build/.env')
fs.copyFileSync('.env.production', './build/.env')
console.log('Copying checkPort.js to ./build/checkPort.js')
fs.copyFileSync('checkPort.js', './build/checkPort.js')
console.log('Copying stop.js to ./build/stop.js')
fs.copyFileSync('stop.js', './build/stop.js')
console.log('Copying useNgrok.js to ./build/useNgrok.js')
fs.copyFileSync('useNgrok.js', './build/useNgrok.js')
console.log('creating logs folder')
fs.mkdirSync('./build/logs', { recursive: true })
console.log('Copying assets seeder to ./build/assets')
fs.cpSync('database/seeders/assets/', './build/database/seeders/assets/', { recursive: true })
