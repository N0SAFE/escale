import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'
import {
    getSession,
    getUser,
    isLogin,
    refreshToken,
    setSession,
} from '@/lib/auth'
import { cookies } from 'next/headers'

const removePrefix = (value: string, prefix: string) =>
    value.startsWith(prefix) ? value.slice(prefix.length) : value

const withAuth: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const res = (await next(request, _next)) as NextResponse
        if (!(await isLogin({ cookieStore: request.cookies }))) {
            const redirectUrl = new URL('/login', request.url)
            if (request.nextUrl.pathname !== '/') {
                redirectUrl.searchParams.set(
                    'redirectPath',
                    removePrefix(request.nextUrl.href, request.nextUrl.origin)
                )
                redirectUrl.searchParams.set(
                    'error',
                    'You need to login to access this page'
                )
            }
            const redirectResponse = NextResponse.redirect(redirectUrl)
            try {
                const session = await refreshToken(
                    true,
                    request.cookies,
                    res.cookies,
                    redirectResponse.cookies
                )
                if (
                    !(await isLogin({ cookieStore: request.cookies, session }))
                ) {
                    return redirectResponse
                }
            } catch (e) {
                return redirectResponse
            }
        }
        return res
    }
}

export default withAuth

export const matcher: Matcher = [
    '/dashboard',
    '/settings',
    '/profile',
    '/logout',
]
