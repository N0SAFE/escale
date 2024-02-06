const { spawn } = require('child_process')
const clc = require('cli-color')

require('dotenv').config()

async function main() {
  const child = spawn('npm run dev', {
    shell: true,
    stdio: 'inherit',
  })

  child.on('exit', function (code, signal) {
    console.log('child process exited with ' + `code ${code} and signal ${signal}`)
  })

  await new Promise((resolve) => setTimeout(resolve, 8000))

  fetch(`http://127.0.0.1:${process.env.PORT}/health`)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data)
      child.kill()
      if (data.healthy) {
        console.log(clc.green('API is healthy'))
        process.exit(0)
      } else {
        console.error(clc.red('API is not healthy'))
        process.exit(1)
      }
    })
    .catch(function (err) {
      console.error(err)
      process.exit(1)
    })
}

main()
