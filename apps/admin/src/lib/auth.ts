'use server'

import { axiosInstance } from '@/utils/axiosInstance'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export type Jwt = {
    token?: string
    type?: string
    expires_at: string
    refreshToken?: string
}

export type User = {
    email: string
    id: number
    roles: string[]
    created_at: string
    updated_at: string
}

export type Session =
    | {
          authenticationAttempted: true
          isAuthenticated: true
          isGuest: false
          isLoggedIn: true
          jwt: Jwt
          user: User
      }
    | {
          authenticationAttempted: true
          isAuthenticated: false
          isGuest: true
          isLoggedIn: false
          jwt: null | Jwt
          user: null
      }

export async function setSession(session: Session): Promise<Session | null> {
    const expiresAt = (() => {
        if (session?.isAuthenticated) {
            // console.log(session.jwt.expires_at)
            return new Date(session.jwt.expires_at)
        } else {
            return new Date(0)
        }
    })()

    // console.log("expiresAt", expiresAt);
    // console.log(session)
    // console.log(session?.jwt?.refreshToken)
    // console.log(response) {
    const cookieStore = cookies()
    cookieStore.set('session', JSON.stringify(session), {
        path: '/',
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        expires: expiresAt,
    })
    cookieStore.set(
        'jwt',
        JSON.stringify({
            token: session?.jwt?.token,
            type: session?.jwt?.type,
            expires_at: session?.jwt?.expires_at,
        }) || '',
        {
            path: '/',
            httpOnly: false,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            expires: expiresAt,
        }
    )
    cookieStore.set('refreshToken', session?.jwt?.refreshToken || '', {
        path: '/',
        httpOnly: false,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
    })

    return session
}

async function getJwt(): Promise<Jwt | null> {
    return (await getSession())?.jwt || null
}

export async function updateSession(
    session: Partial<Session>
): Promise<Session | null> {
    const oldSession = await getSession()
    return setSession({ ...oldSession, ...session } as Session)
}

export async function getSession(): Promise<Session | null> {
    'use server'

    const cookieStore = cookies()
    const sessionString = cookieStore.get('session')?.value
    const jwtString = cookieStore.get('jwt')?.value
    // console.log(jwtString)
    const refreshTokenString = cookieStore.get('refreshToken')?.value
    if (!sessionString && !refreshTokenString) {
        return null
    }
    try {
        const session = sessionString
            ? JSON.parse(sessionString)
            : {
                  authenticationAttempted: false,
                  isAuthenticated: false,
                  isGuest: true,
                  isLoggedIn: false,
                  jwt: null,
                  user: null,
              }
        const jwt = jwtString ? JSON.parse(jwtString) : {}
        // console.log(jwt)
        jwt.refreshToken = refreshTokenString
        session.jwt = jwt
        return session
    } catch {
        return null
    }
}

export async function getUser(): Promise<User | null> {
    'use server'

    return (await getSession())?.user || null
}

export async function cookiesGetAll() {
    'use server'

    return cookies().getAll()
}

export async function refreshToken(retry?: boolean): Promise<Session> {
    'use server'

    // console.log('refreshing token')
    // console.log((await getSession())?.jwt?.refreshToken)

    return axiosInstance
        .post<any, AxiosResponse<any, { _retry: boolean }>>('/refresh', {}, {
            withCredentials: true,
            headers: {
                refresh_token: (await getSession())?.jwt?.refreshToken,
            },
            _retry: retry,
        } as any)
        .then(async (res) => {
            // console.log(res)
            const jwt = res.data
            // console.log("refreshToken", res.data);
            return axiosInstance
                .get<Session>('/whoami', {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${res.data.token}`,
                    },
                })
                .then(async (res) => {
                    // console.log(res)
                    const session = {
                        ...res.data,
                        jwt: jwt,
                    }
                    await setSession(session)
                    return session
                })
        })
        .catch(async function (e) {
            // console.log("refresh error")
            // console.log(e) // ! i am here
            await setSession({
                authenticationAttempted: true,
                isAuthenticated: false,
                isGuest: true,
                isLoggedIn: false,
                jwt: null,
                user: null,
            })
            return {
                authenticationAttempted: true,
                isAuthenticated: false,
                isGuest: true,
                isLoggedIn: false,
                jwt: null,
                user: null,
            }
        })
}

export async function whoami(): Promise<Session> {
    'use server'

    const jwt = (await getSession())?.jwt
    const whoami = await axiosInstance
        .get('/whoami', {
            withCredentials: true,
            headers: {
                Authorization:
                    (jwt as any)?.token && `Bearer ${(jwt as any).token}`,
            },
        })
        .then((res) => res.data)
    const newSession = whoami
    if (whoami.isAuthenticated) {
        newSession.jwt = jwt
        setSession(newSession)
        return newSession
    } else {
        newSession.jwt = null
        setSession(newSession)
        return newSession
    }
}

export async function login(
    email: string,
    password: string
): Promise<Session | null> {
    'use server'

    return axiosInstance
        .post(
            '/login',
            {
                email,
                password,
            },
            { withCredentials: true }
        )
        .then(async (res) => {
            const jwt = res.data
            return axiosInstance
                .get<Session>('/whoami', {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${res.data.token}`,
                    },
                })
                .then((res) => {
                    const session = {
                        ...res.data,
                        jwt: jwt,
                    }
                    // console.log(jwt)
                    // console.log(session)
                    setSession(session)
                    return session
                })
        })
        .catch((e) => {
            return null
        })
}

export async function logout() {
    'use server'

    // console.log('logout')

    const token = (await getSession())?.jwt?.token
    // console.log(await getSession())

    return axiosInstance
        .post(
            '/logout',
            {},
            {
                withCredentials: true,
                headers: {
                    Authorization: token && `Bearer ${token}`,
                },
            }
        )
        .then(async () => {
            // console.log('logout successful')
            await setSession({
                authenticationAttempted: true,
                isAuthenticated: false,
                isGuest: true,
                isLoggedIn: false,
                jwt: null,
                user: null,
            })
        })
}

export async function recreteJwt() {
    'use server'

    return axiosInstance
        .get('/recreate-jwt', {
            // todo
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${(await getSession())?.jwt?.token}`,
            },
        })
        .then(async (res) => {
            const jwt = res.data
            return axiosInstance
                .get<Session>('/whoami', {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${res.data.token}`,
                    },
                })
                .then((res) => {
                    const session = {
                        ...res.data,
                        jwt: jwt,
                    }
                    setSession(session)
                    return session
                })
        })
}

export async function isLogin(session?: Session) {
    if (session) {
        return session?.isAuthenticated
    }
    return getSession()?.then((res) => res?.isAuthenticated)
}
