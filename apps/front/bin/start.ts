import { spawn, spawnSync } from 'child_process'
import { config } from 'dotenv'

config()

if (!process.env.PORT) {
    throw new Error('PORT environment variable is required')
}

spawn(`next start -p ${process.env.PORT}`, {
    shell: true,
    stdio: 'inherit',
})
