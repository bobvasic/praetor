import { Connection } from "@solana/web3.js";

export function getQuickNodeRpcUrl() {
  const rpcUrl = process.env.QUICKNODE_RPC_URL;

  if (!rpcUrl) {
    throw new Error("Missing QUICKNODE_RPC_URL. Configure a Solana Devnet QuickNode RPC endpoint.");
  }

  return rpcUrl;
}

export function createQuickNodeConnection() {
  const rpcUrl = getQuickNodeRpcUrl();

  return new Connection(rpcUrl, "confirmed");
}

export async function requestQuickNodeRpc<T>(method: string, params: unknown[] = []) {
  const response = await fetch(getQuickNodeRpcUrl(), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "praetor",
      method,
      params,
    }),
  });

  if (!response.ok) {
    throw new Error(`Solana RPC HTTP ${response.status}`);
  }

  const body = (await response.json()) as { result?: T; error?: { message?: string } };
  if (body.error) {
    throw new Error(body.error.message ?? `Solana RPC ${method} failed`);
  }

  return body.result as T;
}

export function cleanSolanaError(error: unknown) {
  return error instanceof Error ? error.message : "Solana RPC request failed";
}
