// src/app/api/debug-cookies/route.ts
import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  return NextResponse.json({
    cookies: request.cookies.getAll().map((c) => ({ name: c.name })),
    headers: Object.fromEntries(request.headers),
    url: request.url,
  });
}
