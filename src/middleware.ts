import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    console.log("Middleware running on path:", request.nextUrl.pathname);

    // const sessionCookie = getSessionCookie(request, {
    //   cookieName: "session_token",
    // }); //edguje se
    const sessionCookie = request.cookies
      .getAll()
      .find((c) => c.name.includes("session_token"))?.value;

    console.log("Session cookie found:", !!sessionCookie, sessionCookie);

    if (!sessionCookie) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("redirectTo", request.url);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    const signInUrl = new URL("/sign-in", request.url);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: [
    "/studio",
    "/playlists",
    "/playlists/history",
    "/playlists/liked",
    "/feed/subscribed",
  ],
};
