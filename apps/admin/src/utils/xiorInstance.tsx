import { getSession, isLogin, refreshToken } from '@/lib/auth'
import { redirect } from 'next/navigation'
import xior from 'xior'

export const xiorInstance = xior.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
})

xiorInstance.interceptors.request.use(async (config) => {
    // console.log('interceptor')
    // const session = await getSession()
    // console.log(config)
    // console.log("here's the session", session)
    // const token = session?.jwt?.token
    // const refreshToken = session?.jwt?.refreshToken
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`
    //     config.headers.refresh_token = refreshToken
    // }
    // console.log('config', config)
    const {
        baseURL: configBaseUrl,
        data: configData,
        method: configMethod,
        headers: configHeaders,
        withCredentials: configCredentials,
        params: configParams,
        url: _,
        ...rest
    } = config
    const config_Url = config._url || config.url

    config.method = 'POST'
    config.baseURL = process.env.NEXT_PUBLIC_ADMIN_URL
    config._url = '/api' + config_Url
    config.url = '/api' + config_Url
    config.params = {}
    config.data = {
        data: configData || '',
        baseUrl: configBaseUrl,
        method: configMethod,
        headers: configHeaders,
        withCredentials: configCredentials,
        params: configParams,
        ...rest,
    }

    return config
})
