export class PublicKey {
  constructor(value: string | Uint8Array | number[]);
  toBase58(): string;
  toBytes(): Uint8Array;
  equals(other: PublicKey): boolean;
}
export class TransactionInstruction {
  constructor(args: { keys?: Array<{ pubkey: PublicKey; isSigner: boolean; isWritable: boolean }>; programId: PublicKey; data?: Buffer | Uint8Array });
  keys: Array<{ pubkey: PublicKey; isSigner: boolean; isWritable: boolean }>;
  programId: PublicKey;
  data: Uint8Array;
}
export class Transaction {
  feePayer?: PublicKey;
  recentBlockhash?: string;
  signatures: Array<{ publicKey: PublicKey; signature: Uint8Array | null }>;
  add(...items: TransactionInstruction[]): Transaction;
  serializeMessage(): Uint8Array;
  addSignature(publicKey: PublicKey, signature: Uint8Array | Buffer): void;
  serialize(options?: { requireAllSignatures?: boolean; verifySignatures?: boolean }): Buffer;
  static from(buffer: Buffer | Uint8Array): Transaction;
}
export class Connection {
  constructor(endpoint: string, commitment?: string);
  getHealth(): Promise<string>;
  getSlot(): Promise<number>;
  getLatestBlockhash(): Promise<{ blockhash: string; lastValidBlockHeight: number }>;
  sendRawTransaction(rawTransaction: Buffer | Uint8Array, options?: Record<string, unknown>): Promise<string>;
  confirmTransaction(signature: string | { signature: string; blockhash?: string; lastValidBlockHeight?: number }, commitment?: string): Promise<unknown>;
  getSignatureStatuses(signatures: string[]): Promise<{ value: Array<unknown | null> }>;
}
export const clusterApiUrl: (cluster: string) => string;
