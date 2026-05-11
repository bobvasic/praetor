import { NextRequest, NextResponse } from "next/server";
import { cleanSolanaError, createQuickNodeConnection } from "@/lib/solana/server";

export const dynamic = "force-dynamic";

// Lightweight signature lookup so the client can poll for on-chain
// confirmation without holding open a long-running server request (which
// trips the DO/Cloudflare gateway timeout). One QuickNode call per poll.
export async function GET(request: NextRequest) {
  try {
    const signature = request.nextUrl.searchParams.get("signature");

    if (!signature || signature.length < 32 || signature.length > 128) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid signature" },
        { status: 400 },
      );
    }

    const connection = createQuickNodeConnection();
    const { value } = await connection.getSignatureStatuses([signature]);
    const status = value[0] as
      | { confirmationStatus?: string; slot?: number; err?: unknown }
      | null;

    return NextResponse.json({
      ok: true,
      signature,
      confirmationStatus: status?.confirmationStatus ?? null,
      slot: status?.slot ?? null,
      err: status?.err ?? null,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: cleanSolanaError(error) },
      { status: 502 },
    );
  }
}
