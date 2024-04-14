import fs from 'fs'
import {spawn, spawnSync} from 'child_process'
import declarativeRoutingConfig from '../declarative-routing.config.json'

spawn('next dev', {
    shell: true,
    stdio: 'inherit'
})

spawn('npx npx declarative-routing build --watch', {
    shell: true,
})

spawnSync('npm run openapi', {
    shell: true,
})

const routesFile = fs.readFileSync(
    __dirname + '/../' + declarativeRoutingConfig.routes + '/index.ts',
    'utf-8'
)

fs.writeFileSync(
    __dirname + '/../' + declarativeRoutingConfig.routes + '/index.ts',
    routesFile.replace(/\\/g, '/'),
    'utf-8'
)

fs.watchFile(
    __dirname + '/../' + declarativeRoutingConfig.routes + '/index.ts',
    {},
    () => {
        const routesFile = fs.readFileSync(
            __dirname + '/../' + declarativeRoutingConfig.routes + '/index.ts',
            'utf-8'
        )
        
        const updatedRoutesFile = routesFile.replace(/\\/g, '/')
        
        if (routesFile === updatedRoutesFile) {
            return
        }
        
        fs.writeFileSync(
            __dirname + '/../' + declarativeRoutingConfig.routes + '/index.ts',
            routesFile.replace(/\\/g, '/'),
            'utf-8'
        )
        
        
        spawnSync('npm run openapi', {
            shell: true,
        })
        
        console.log('Routes file updated')
    }
)
