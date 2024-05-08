import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'
import ObjectToMap from './utils/ObjectToMap'

const withRedirect: MiddlewareFactory = (next: NextMiddleware) => {
    return async (
        request: NextRequest,
        _next: NextFetchEvent,
        key?: string | number
    ) => {
        const res = await next(request, _next)
        if (request.nextUrl.pathname.startsWith('/_next')) {
            return res
        }
        const redirectMap = ObjectToMap({})
        const path = redirectMap.get(key as string) as string
        if (key && path) {
            return NextResponse.redirect(new URL(path, request.url))
        }
        return res
    }
}

export default withRedirect

export const matcher: Matcher = {}
