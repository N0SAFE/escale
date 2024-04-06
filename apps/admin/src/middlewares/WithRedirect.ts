import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'

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
        switch (key) {
            case 'reservations':
                return NextResponse.redirect(
                    new URL('/dashboard/reservations/calendar', request.url)
                )
            case 'availabilities':
                return NextResponse.redirect(
                    new URL('/dashboard/availabilities/calendar', request.url)
                )
            case 'dashboard':
                return NextResponse.redirect(
                    new URL('/dashboard/spas', request.url)
                )
            case 'main':
                return NextResponse.redirect(new URL('/dashboard', request.url))
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
}
