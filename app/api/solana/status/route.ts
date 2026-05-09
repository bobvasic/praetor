import { NextResponse } from "next/server";
import { SOLANA_EXPLORER_CLUSTER, SOLANA_NETWORK, SOLANA_RPC_PROVIDER } from "@/lib/solana/constants";
import { cleanSolanaError, createQuickNodeConnection } from "@/lib/solana/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const connection = createQuickNodeConnection();
    const [health, slot, latestBlockhash] = await Promise.all([
      connection.getHealth(),
      connection.getSlot(),
      connection.getLatestBlockhash(),
    ]);

    return NextResponse.json({
      ok: true,
      network: SOLANA_NETWORK,
      rpcProvider: SOLANA_RPC_PROVIDER,
      slot,
      health,
      blockhashPreview: `${latestBlockhash.blockhash.slice(0, 8)}…${latestBlockhash.blockhash.slice(-6)}`,
      explorerCluster: SOLANA_EXPLORER_CLUSTER,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        network: SOLANA_NETWORK,
        rpcProvider: SOLANA_RPC_PROVIDER,
        error: cleanSolanaError(error),
      },
      { status: 503 },
    );
  }
}
