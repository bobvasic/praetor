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
      { ok: false, accepted: false, source: "quicknode" },
      { status: 401 },
    );
  }

  await readJsonSafely(request);

  return NextResponse.json({
    ok: true,
    accepted: true,
    source: "quicknode",
    mode: configuredSecret ? "verified" : "demo",
  });
}
