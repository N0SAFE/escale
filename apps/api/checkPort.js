const waitPort = require('wait-port')
const dotenv = require('dotenv')
const childProcess = require('child_process')
const clc = require('cli-color')
dotenv.config()

const args = process.argv.slice(2)

if (!process.env.PORT) {
  console.error('Please define the PORT environment variable inside .env')
  process.exit(1)
}

const params = {
  port: Number(process.env.PORT),
  timeout: 100, // in ms, default 0
  output: 'silent', // or 'console' for stdout and stderr logs
}

waitPort(params)
  .then(({ open, ipVersion }) => {
    if (open) {
      throw new Error(clc.red(`Port is already open (version ${ipVersion})!`))
    } else {
      childProcess.spawn(args.join(' '), { stdio: 'inherit', shell: true })
    }
  })
  .catch((err) => {
    throw new Error(clc.red(`An error occured while waiting for the port: ${err}`))
  })
