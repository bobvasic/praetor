import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function removedSimulationResponse() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Local incident simulation has been removed. Use /api/solana/status and wallet-signed devnet attestations for real Solana devnet data.",
    },
    { status: 410 },
  );
}

export const GET = removedSimulationResponse;
export const POST = removedSimulationResponse;
