// copy .env.production to ./build/.env
const fs = require('fs')

if (!fs.existsSync('./.env.production')) {
  console.error('.env.production file not found')
  process.exit(1)
}
console.log('Copying .env.production to ./build/.env')
fs.copyFileSync('.env.production', './build/.env')
