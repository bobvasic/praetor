import { NextResponse } from "next/server";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import {
  PRAETOR_ANCHOR_PROGRAM_ID,
  SOLANA_EXPLORER_CLUSTER,
  SOLANA_NETWORK,
  SOLANA_RPC_PROVIDER,
  getExplorerAddressUrl,
} from "@/lib/solana/constants";
import { cleanSolanaError, createQuickNodeConnection, requestQuickNodeRpc } from "@/lib/solana/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const connection = createQuickNodeConnection();
    const programPublicKey = new PublicKey(PRAETOR_ANCHOR_PROGRAM_ID);
    const [health, slot, latestBlockhash, blockHeight, version, programAccount] = await Promise.all([
      requestQuickNodeRpc<string>("getHealth"),
      connection.getSlot(),
      connection.getLatestBlockhash(),
      connection.getBlockHeight(),
      connection.getVersion(),
      connection.getAccountInfo(programPublicKey, "confirmed"),
    ]);

    return NextResponse.json({
      ok: true,
      network: SOLANA_NETWORK,
      rpcProvider: SOLANA_RPC_PROVIDER,
      slot,
      health,
      blockhashPreview: `${latestBlockhash.blockhash.slice(0, 8)}…${latestBlockhash.blockhash.slice(-6)}`,
      lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      blockHeight,
      solanaCore: version["solana-core"],
      explorerCluster: SOLANA_EXPLORER_CLUSTER,
      program: {
        address: PRAETOR_ANCHOR_PROGRAM_ID,
        explorerUrl: getExplorerAddressUrl(PRAETOR_ANCHOR_PROGRAM_ID),
        exists: Boolean(programAccount),
        executable: programAccount?.executable ?? false,
        owner: programAccount?.owner.toBase58() ?? null,
        lamports: programAccount?.lamports ?? null,
        sol: programAccount ? programAccount.lamports / LAMPORTS_PER_SOL : null,
        dataLength: programAccount?.data.length ?? null,
      },
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
