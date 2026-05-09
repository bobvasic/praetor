import { Connection } from "@solana/web3.js";

export function createQuickNodeConnection() {
  const rpcUrl = process.env.QUICKNODE_RPC_URL;

  if (!rpcUrl) {
    throw new Error("Missing QUICKNODE_RPC_URL. Configure a Solana Devnet QuickNode RPC endpoint.");
  }

  return new Connection(rpcUrl, "confirmed");
}

export function cleanSolanaError(error: unknown) {
  return error instanceof Error ? error.message : "Solana RPC request failed";
}
