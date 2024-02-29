import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from "next/server";
import { MiddlewareFactory } from "./types";

export const withHealthCheck: MiddlewareFactory = (next: NextMiddleware) => {
    return async (request: NextRequest, _next: NextFetchEvent) => {
        const res = await next(request, _next);
        if (request.nextUrl.pathname.startsWith("/_next")){
            return res
        }
        if (res) {
            if (process.env.NODE_ENV === "development") {
                try {
                    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/health", {
                        cache: "force-cache",
                        next: { revalidate: 100 }
                    }).then((res) => res.json());
                    if (!res.healthy) {
                        return NextResponse.json({ error: "API is not healthy", data: res }, { status: 500 });
                    }
                } catch {
                    return NextResponse.json({ error: "API is not healthy" }, { status: 500 });
                }
            }
        }
        return res;
    };
};
