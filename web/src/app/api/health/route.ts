import { NextResponse } from "next/server";

/**
 * Health-check API (backend-присутствие).
 * В боевом режиме сюда же добавляется проверка подключения к Supabase.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "stoa-web",
    time: new Date().toISOString(),
    backend: process.env.NEXT_PUBLIC_SUPABASE_URL ? "supabase" : "demo-local",
  });
}
