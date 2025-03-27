import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  try {
    const sessionCookie = getSessionCookie(request);
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
