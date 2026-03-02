import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Trip ID required" }, { status: 400 });
  }

  // TODO: Get user from session when auth is configured
  return NextResponse.json(
    { error: "Authentication required. Use localStorage for guest trips." },
    { status: 401 }
  );
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Trip ID required" }, { status: 400 });
  }

  return NextResponse.json(
    { error: "Authentication required. Use localStorage for guest trips." },
    { status: 401 }
  );
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Trip ID required" }, { status: 400 });
  }

  return NextResponse.json(
    { error: "Authentication required. Use localStorage for guest trips." },
    { status: 401 }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Trip ID required" }, { status: 400 });
  }

  return NextResponse.json(
    { error: "Authentication required. Use localStorage for guest trips." },
    { status: 401 }
  );
}
