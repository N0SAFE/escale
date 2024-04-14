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

const withAuth: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const res = (await next(request, _next)) as NextResponse
        if (request.nextUrl.pathname.startsWith('/_next')) {
            return res
        }
        const redirectUrl = new URL('/login', request.url)
        if (request.nextUrl.pathname !== '/') {
            redirectUrl.searchParams.set(
                'redirectPath',
                request.nextUrl.pathname
            )
            redirectUrl.searchParams.set(
                'error',
                'You need to login to access this page'
            )
        }
        if (!(await isLogin({ cookieStore: request.cookies }))) {
            console.log('is not logged in')
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
                    console.log('is not logged in after refresh')
                    return redirectResponse
                }
            } catch (e) {
                console.error(e)
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
