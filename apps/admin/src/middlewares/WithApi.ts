import {
    NextFetchEvent,
    NextMiddleware,
    NextRequest,
    NextResponse,
} from 'next/server'
import { Matcher, MiddlewareFactory } from './utils/types'
import { xiorInstance } from '@/utils/xiorInstance'
import { xior } from 'xior'
import { getSession, isLogin, refreshToken } from '@/lib/auth'
import { redirect } from 'next/navigation'

const serverSideXiorInstance = xior.create()

// if the request does not work with the token, try to use the refresh token to get a new token
serverSideXiorInstance.interceptors.response.use(
    (response) => {
        return response
    },
    async (error) => {
        const originalRequest = error.config
        if (
            originalRequest &&
            error.response?.status === 401 &&
            !(originalRequest as any)._retry
        ) {
            console.log('401 error, refreshing token...')
            if (!(await getSession())?.jwt?.refreshToken) {
                console.log('no session')
                return Promise.reject(redirect('/login'))
            }
            const session = await refreshToken(true)
            if (await isLogin({ session })) {
                console.log('token as been refreshed')
                const tokenType = session?.jwt?.type
                const token = session?.jwt?.token
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `${tokenType} ${token}`
                }
                return serverSideXiorInstance.request(originalRequest)
            } else {
                console.log("token can't be refreshed")
            }
        }
        return Promise.reject(error)
    }
)

type RequestBodyType = {
    data: any
    baseUrl: string
    method:
        | 'POST'
        | 'GET'
        | 'PUT'
        | 'DELETE'
        | 'PATCH'
        | 'OPTIONS'
        | 'HEAD'
        | 'CONNECT'
        | 'TRACE'
    headers: Record<string, any>
    withCredentials: boolean
    [key: string]: any
}

const withApi: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const res = await next(request, _next)
        const body: RequestBodyType = await request.json()

        const session = await getSession()
        const token = session?.jwt?.token
        const refreshToken = session?.jwt?.refreshToken

        try {
            if (!body.method) {
                return await Response.json({ error: 'error' })
            }
            if (!body.baseUrl) {
                return await Response.json({ error: 'error' })
            }
            if (!body.data && body.data !== '') {
                return await Response.json({ error: 'error' })
            }
            const {
                method,
                baseUrl,
                data: D,
                headers,
                withCredentials,
                ...bodyRest
            } = body

            const { data } = await serverSideXiorInstance.fetch({
                method: method,
                url:
                    baseUrl +
                    request.nextUrl.pathname.split('/api', 2).slice(1).join(),
                data: D || {},
                headers: {
                    Authorization: `Bearer ${token}`,
                    refresh_token: refreshToken,
                    ...headers,
                },
                withCredentials: withCredentials,
                ...bodyRest,
            })
            return await Response.json(data)
        } catch (e) {
            return await Response.json(e, { status: 500 })
        }
    }
}

export default withApi

export const matcher: Matcher = {
    api: '^/api/',
}
