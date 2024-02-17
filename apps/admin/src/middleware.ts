import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import axios from 'axios';
import { cookies } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if (process.env.NODE_ENV === "development") {
        try {
            const res = (
                await fetch(process.env.NEXT_PUBLIC_API_URL + "/health", {
                    cache: "force-cache",
                    next: { revalidate: 100 }
                }).then((res) => res.json())
            )
            if (
                res.healthy
            ) {
                return NextResponse.next();
            } else {
                return Response.json({ error: "API is not healthy", data: res }, { status: 500 });
            }
        } catch {
            return Response.json({ error: "API is not healthy" }, { status: 500 });
        }
    }
    // if (getSession() === null) {
    //     axios.get('/me')
    // }
    
}
