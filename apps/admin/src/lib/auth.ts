"use server";

import axios from "axios";
import { cookies } from "next/headers";
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

axios.interceptors.request.use(async (config) => {
    const session = await getSession();
    const token = session?.jwt?.token;
    const refreshToken = session?.jwt?.refreshToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers.refresh_token = refreshToken;
    }
    return config;
});

// if the request does not work with the token, try to use the refresh token to get a new token
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            await refreshToken();
            if ((await getSession())?.isAuthenticated) {
                return axios(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export type Session =
    | {
          authenticationAttempted: true;
          isAuthenticated: true;
          isGuest: false;
          isLoggedIn: true;
          jwt: {
              expires_at: string;
              refreshToken: string;
              token: string;
              type: string;
          };
          user: {
              email: string;
              id: number;
              roles: string[];
              created_at: string;
              updated_at: string;
          };
      }
    | {
          authenticationAttempted: true;
          isAuthenticated: false;
          isGuest: true;
          isLoggedIn: false;
          jwt: null;
      };

async function setSession(session: Session): Promise<Session | null> {
    const cookieStore = cookies();
    cookieStore.set("session", JSON.stringify(session), {
        path: "/",
        httpOnly: false,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });
    return session;
}

export async function updateSession(session: Session): Promise<Session | null> {
    const cookieStore = cookies();
    const oldSession = cookieStore.get("session")?.value;
    if (!oldSession) return setSession(session);
    const newSession = JSON.stringify({ ...JSON.parse(oldSession), ...session });
    cookieStore.set("session", newSession, {
        path: "/",
        httpOnly: false,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production"
    });
    return session;
}

export async function getSession(): Promise<Session | null> {
    "use server";

    const cookieStore = cookies();
    const sessionString = cookieStore.get("session")?.value;
    if (!sessionString) return null;
    try {
        return JSON.parse(sessionString);
    } catch {
        return null;
    }
}

export async function cookiesGetAll() {
    "use server";

    return cookies().getAll();
}

export async function refreshToken() {
    "use server";

    return axios
        .post(
            "/refresh",
            {},
            {
                withCredentials: true,
                headers: {
                    refresh_token: (await getSession())?.jwt?.refreshToken
                }
            }
        )
        .then(async (res) => {
            return axios
                .get<Session>("/whoami", {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${res.data.token}`
                    }
                })
                .then((res) => {
                    setSession(res.data);
                    return res.data;
                });
        });
}

export async function whoami(): Promise<Session> {
    "use server";

    const token = (await getSession())?.jwt?.token;
    const whoami = await axios
        .get("/whoami", {
            withCredentials: true,
            headers: {
                Authorization: token && `Bearer ${token}`
            }
        })
        .then((res) => res.data);
    const newSession = whoami;
    if (whoami.isAuthenticated) {
        newSession.jwt = (await getSession())?.jwt;
        setSession(newSession);
        return newSession;
    } else {
        newSession.jwt = null;
        setSession(newSession);
        return newSession;
    }
}

export async function login(email: string, password: string) {
    "use server";

    console.log(email, password);

    return axios
        .post(
            "/login",
            {
                email,
                password
            },
            { withCredentials: true }
        )
        .then(async (res) => {
            const jwt = res.data;
            return axios
                .get<Session>("/whoami", {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${res.data.token}`
                    }
                })
                .then((res) => {
                    const session = {
                        ...res.data,
                        jwt: jwt
                    };
                    setSession(session);
                    return session;
                });
        });
}

export async function logout() {
    "use server";

    return axios.post("/logout", {}, { withCredentials: true }).then(async () => {
        await setSession({
            authenticationAttempted: true,
            isAuthenticated: false,
            isGuest: true,
            isLoggedIn: false,
            jwt: null
        });
    });
}

export async function recreteJwt() {
    "use server";

    return axios
        .get("/recreate-jwt", { // todo
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${(await getSession())?.jwt?.token}`
            }
        })
        .then(async (res) => {
            const jwt = res.data;
            return axios
                .get<Session>("/whoami", {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${res.data.token}`
                    }
                })
                .then((res) => {
                    const session = {
                        ...res.data,
                        jwt: jwt
                    };
                    setSession(session);
                    return session;
                });
        });
}
