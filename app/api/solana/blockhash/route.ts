import { NextResponse } from "next/server";
import { cleanSolanaError, createQuickNodeConnection } from "@/lib/solana/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const connection = createQuickNodeConnection();
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();

    return NextResponse.json({
      ok: true,
      blockhash,
      lastValidBlockHeight,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: cleanSolanaError(error) },
      { status: 503 },
    );
  }
}
