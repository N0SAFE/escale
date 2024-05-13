import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'
import ObjectToMap from './utils/ObjectToMap'
import { xiorInstance } from '@/utils/xiorInstance'

type ReservationType = {
    id: number
}[]

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
            reservation: async () => {
                const { data } = await xiorInstance.get<ReservationType>(
                    '/spas'
                )
                return `/reservation/${data?.[0]?.id}`
            },
        }) as Map<
            string,
            string | ((request: NextRequest) => string | Promise<string>)
        >
        const p = redirectMap.get(key as string)
        if (key && p) {
            if (typeof p === 'function') {
                const path = await p(request)
                return NextResponse.redirect(new URL(path, request.url))
            }
            return NextResponse.redirect(new URL(p, request.url))
        }
        return res
    }
}

export default withRedirect

export const matcher: Matcher = {
    reservation: '^/reservation$',
}
