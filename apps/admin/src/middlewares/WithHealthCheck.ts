import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { MiddlewareFactory } from './utils/types'
import { xiorInstance } from '@/utils/xiorInstance'

export const withHealthCheck: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const res = await next(request, _next)
        if (request.nextUrl.pathname.startsWith('/_next')) {
            return res
        }
        if (request.nextUrl.pathname.startsWith('/api')) {
            return res
        }
        if (res) {
            if (process.env.NODE_ENV === 'development') {
                try {
                    const { data } = await xiorInstance.get('/health')
                    if (!data.healthy) {
                        return NextResponse.json(
                            { error: 'API is not healthy', data },
                            { status: 500 }
                        )
                    }
                } catch {
                    return NextResponse.json(
                        { error: 'API is not healthy' },
                        { status: 500 }
                    )
                }
            }
        }
        return res
    }
}
