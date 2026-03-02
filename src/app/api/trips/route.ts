import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function GET() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Trips API not configured" },
      { status: 503 }
    );
  }

  // TODO: Get user from session (cookies/JWT) when auth is configured
  // For now, trips are stored in localStorage on the client
  return NextResponse.json(
    { error: "Authentication required. Use localStorage for guest trips." },
    { status: 401 }
  );
}

export async function POST() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: "Trips API not configured" },
      { status: 503 }
    );
  }

  // TODO: Get user from session when auth is configured
  return NextResponse.json(
    { error: "Authentication required. Use localStorage for guest trips." },
    { status: 401 }
  );
}
