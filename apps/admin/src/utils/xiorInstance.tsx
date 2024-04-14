import { getSession, isLogin, refreshToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import xior from 'xior'

export const xiorInstance = xior.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

xiorInstance.interceptors.request.use(async (config) => {
    const session = await getSession()
    const token = session?.jwt?.token
    const refreshToken = session?.jwt?.refreshToken
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
        config.headers.refresh_token = refreshToken
    }
    return config
})

// if the request does not work with the token, try to use the refresh token to get a new token
xiorInstance.interceptors.response.use(
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
                return xiorInstance.request(originalRequest)
            } else {
                console.log("token can't be refreshed")
            }
        }
        return Promise.reject(error)
    }
)
