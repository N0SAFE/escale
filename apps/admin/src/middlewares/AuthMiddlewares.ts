import {
  NextFetchEvent,
  NextMiddleware,
  NextRequest,
  NextResponse,
} from "next/server";
import { MiddlewareFactory } from "./types";
import { getSession, getUser, isLogin, setSession } from "@/lib/auth";
import { cookies } from "next/headers";

export const withAuth: MiddlewareFactory = (next: NextMiddleware) => {
  return async (request: NextRequest, _next: NextFetchEvent) => {
    const res = await next(request, _next);
    // if (request.nextUrl.pathname.startsWith("/_next")){
    //     return res
    // }
    // if (request.nextUrl.pathname.startsWith("/dashboard")){
    //     (res as NextResponse)?.cookies?.set?.("x-pathname", request.nextUrl.pathname)
    // }
    // if (!(await isLogin())) {
    //     const refreshTokenString = (await getSession())?.jwt?.refreshToken;
    //     if (refreshTokenString) {
    //         try {
    //             console.log("refreshTokenString", refreshTokenString);
    //             await fetch(process.env.NEXT_PUBLIC_API_URL + "/refresh", {
    //                 method: "POST",
    //                 headers: {
    //                     refresh_token: refreshTokenString
    //                 }
    //             }).then(async (res) => {
    //                 const jwt = await res.json()
    //                 fetch(process.env.NEXT_PUBLIC_API_URL + "/whoami", {
    //                     method: "GET",
    //                     headers: {
    //                         Authorization: `Bearer ${jwt.token}`
    //                     }
    //                 }).then(async (res) => {
    //                     const data = await res.json()
    //                     const session = {
    //                         ...data,
    //                         jwt: jwt
    //                     };
    //                     setSession(session, {response: (res as NextResponse)});
    //                     return session;
    //                 })
    //             })
    //             console.log(await getSession())
    //         } catch (e) {
    //             console.log(e)
    //         }
    //     }

    // }
    return res;
  };
};
