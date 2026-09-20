import { generatePageSpec } from "@/lib/ai/engine";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/db/server";

export async function POST(request: Request) {
  // 1. Auth check
  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Parse body
  const { intent } = await request.json();
  if (!intent) return NextResponse.json({ error: "Missing intent" }, { status: 400 });

  // 3. Setup AI
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "AI API Key missing on server" }, { status: 500 });

  const config = {
    apiKey,
    model: process.env.AI_MODEL || "llama-3.1-70b-versatile", // fallback
    baseURL: process.env.AI_BASE_URL || "https://api.groq.com/openai/v1/chat/completions",
  };

  try {
    const spec = await generatePageSpec(intent, config);
    return NextResponse.json({ success: true, spec });
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

