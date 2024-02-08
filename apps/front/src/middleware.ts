import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    if (process.env.NODE_ENV === "development") {
        try {
            if (
                (
                    await fetch(process.env.NEXT_PUBLIC_API_URL + "/health", {
                        cache: "force-cache",
                        next: { revalidate: 100 }
                    }).then((res) => res.json())
                ).healthy
            ) {
                return NextResponse.next();
            } else {
                return Response.json({ error: "API is not healthy" }, { status: 500 });
            }
        } catch {
            return Response.json({ error: "API is not healthy" }, { status: 500 });
        }
    }
}
