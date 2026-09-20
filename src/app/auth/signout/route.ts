import { createClient } from "@/lib/db/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}
