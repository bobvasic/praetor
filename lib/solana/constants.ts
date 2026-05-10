export const SOLANA_NETWORK = "devnet";
export const SOLANA_RPC_PROVIDER = "quicknode";
export const SOLANA_EXPLORER_CLUSTER = "devnet";
export const SOLANA_MEMO_PROGRAM_ID = "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr";
export const PRAETOR_INCIDENT_ID = "inc_demo_001";
export const PRAETOR_ANCHOR_PROGRAM_ID =
  process.env.NEXT_PUBLIC_PRAETOR_PROGRAM_ID ??
  "HKQ5WMoZFuT2zrDJyoKKpQFLQgtVMsuHUhuAM1DcqLbk";

export function getExplorerTxUrl(signature: string) {
  return `https://explorer.solana.com/tx/${signature}?cluster=${SOLANA_EXPLORER_CLUSTER}`;
}

export function getExplorerAddressUrl(address: string) {
  return `https://explorer.solana.com/address/${address}?cluster=${SOLANA_EXPLORER_CLUSTER}`;
}
