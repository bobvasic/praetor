import { NextRequest, NextResponse } from "next/server";

async function readJsonSafely(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const configuredSecret = process.env.QUICKNODE_WEBHOOK_SECRET;
  const suppliedSecret = request.headers.get("x-quicknode-secret");

  if (configuredSecret && suppliedSecret !== configuredSecret) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 },
    );
  }

  const payload = await readJsonSafely(request);
  const eventCount = Array.isArray(payload) ? payload.length : payload ? 1 : 0;

  return NextResponse.json({
    ok: true,
    accepted: true,
    source: "quicknode",
    eventCount,
  });
}
