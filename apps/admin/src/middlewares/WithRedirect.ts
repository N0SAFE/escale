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
        const redirectMap = ObjectToMap({
            reservations: '/dashboard/reservations/calendar',
            availabilities: '/dashboard/availabilities/calendar',
            dashboard: '/dashboard/spas',
            website: '/dashboard/website/home',
            main: '/dashboard',
        })
        const path = redirectMap.get(key as string)
        if (key && path) {
            return NextResponse.redirect(new URL(path, request.url))
        }
        return res
    }
}

export default withRedirect

export const matcher: Matcher = {
    main: '^/$',
    dashboard: '^/dashboard$',
    reservations: '^/dashboard/reservations$',
    availabilities: '^/dashboard/availabilities$',
    website: '^/dashboard/website$',
}
