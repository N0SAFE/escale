'use server'

import { xiorInstance } from '@/utils/xiorInstance'
import {
    RequestCookies,
    ResponseCookies,
} from 'next/dist/compiled/@edge-runtime/cookies'
import { cookies } from 'next/headers'

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

export async function setSession(
    session: Session,
    cookiesStore?: RequestCookies | ResponseCookies
): Promise<Session | null> {
    const expiresAt = (() => {
        if (session?.isAuthenticated) {
            return new Date(session.jwt.expires_at)
        } else {
            return new Date(0)
        }
    })()

    const cookieStore = cookiesStore ? cookiesStore : cookies()
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
            expires_at: expiresAt,
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

export async function getJwt(): Promise<Jwt | null> {
    return (await getSession())?.jwt || null
}

export async function updateSession(
    session: Partial<Session>
): Promise<Session | null> {
    const oldSession = await getSession()
    return setSession({ ...oldSession, ...session } as Session)
}

export async function getSession(
    cookiesStore?: RequestCookies | ResponseCookies
): Promise<Session | null> {
    'use server'

    const cookieStore = cookiesStore ? cookiesStore : cookies()
    const sessionString = cookieStore.get('session')?.value
    const jwtString = cookieStore.get('jwt')?.value
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

export async function refreshToken(
    retry?: boolean,
    readCookieStore?: RequestCookies | ResponseCookies,
    writeCookieStoreOnSucess?: RequestCookies | ResponseCookies,
    writeCookieStoreOnError?: RequestCookies | ResponseCookies
): Promise<Session> {
    'use server'

    return xiorInstance
        .post<any>('/refresh', {}, {
            // withCredentials: true,
            headers: {
                refresh_token: (await getSession(readCookieStore))?.jwt
                    ?.refreshToken,
            },
            _retry: retry,
        } as any)
        .then(async (res) => {
            const jwt = res.data
            return xiorInstance
                .get<Session>('/whoami', {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${res.data.token}`,
                    },
                })
                .then(async (res) => {
                    const session = {
                        ...res.data,
                        jwt: jwt,
                    }
                    await setSession(session, writeCookieStoreOnSucess)
                    return session
                })
        })
        .catch(async function (e) {
            await setSession(
                {
                    authenticationAttempted: true,
                    isAuthenticated: false,
                    isGuest: true,
                    isLoggedIn: false,
                    jwt: null,
                    user: null,
                },
                writeCookieStoreOnError
            )
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
    const whoami = await xiorInstance
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

    return xiorInstance
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
            return xiorInstance
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
        .catch((e) => {
            return null
        })
}

export async function logout() {
    'use server'

    const token = (await getSession())?.jwt?.token

    return xiorInstance
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

    return xiorInstance
        .get('/recreate-jwt', {
            // todo
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${(await getSession())?.jwt?.token}`,
            },
        })
        .then(async (res) => {
            const jwt = res.data
            return xiorInstance
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

export async function isLogin(options?: {
    session?: Session
    cookieStore?: RequestCookies | ResponseCookies
}) {
    if (options?.session) {
        return options?.session?.isAuthenticated
    }
    return getSession(options?.cookieStore)?.then((res) => res?.isAuthenticated)
}
