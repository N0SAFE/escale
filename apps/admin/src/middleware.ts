// middleware.ts

import {
    Middleware,
    stackMiddlewares,
} from './middlewares/utils/stackMiddlewares'
import { withHeaders } from './middlewares/WithHeaders'
import { withHealthCheck } from './middlewares/WithHealthCheck'
import * as AuthMiddleware from './middlewares/WithAuth'
import * as WithRedirect from './middlewares/WithRedirect'

const middlewares: Middleware[] = [
    withHeaders,
    withHealthCheck,
    WithRedirect,
    AuthMiddleware,
]
export default stackMiddlewares(middlewares)
