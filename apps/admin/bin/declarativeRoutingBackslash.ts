import fs from 'fs'
import declarativeRoutingConfig from '../declarative-routing.config.json'

const routesFile = fs.readFileSync(
    __dirname + '/../' + declarativeRoutingConfig.routes + '/index.ts',
    'utf-8'
)

const updatedRoutesFile = routesFile.replace(/\\/g, '/')

if (routesFile !== updatedRoutesFile) {
    fs.writeFileSync(
        __dirname + '/../' + declarativeRoutingConfig.routes + '/index.ts',
        updatedRoutesFile,
        'utf-8'
    )
}
