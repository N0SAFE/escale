// middlewares/stackMiddlewares
import { NextResponse } from 'next/server'
import { CustomNextMiddleware, MiddlewareFactory } from './types'

export type Middleware =
    | MiddlewareFactory
    | {
          default: MiddlewareFactory
          matcher?: (string | RegExp)[] | Record<string, string | RegExp>
      }
export function stackMiddlewares(
    functions: Middleware[] = [],
    index = 0
): CustomNextMiddleware {
    const current = functions[index]
    if (current) {
        const next = stackMiddlewares(functions, index + 1)
        if (typeof current === 'function') {
            return current(next)
        }
        const { default: middleware, matcher } = current
        return (req, _next) => {
            if (!matcher) {
                return middleware(next)(req, _next)
            }
            if (Array.isArray(matcher)) {
                const index = matcher.findIndex((m) => req.url.match(m))
                if (index > -1) {
                    return middleware(next)(req, _next, index)
                }
            } else if (typeof matcher === 'object') {
                const key = Object.keys(matcher).find((m) =>
                    req.nextUrl.pathname.match(matcher[m])
                )
                if (key) {
                    return middleware(next)(req, _next, key)
                }
            }
            return next(req, _next)
        }
    }
    return () => NextResponse.next()
}
