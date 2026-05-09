const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE_MAP = new Map([...ALPHABET].map((char, index) => [char, index]));

function encodeBase58(bytes) {
  if (!bytes.length) return "";
  const digits = [0];
  for (const byte of bytes) {
    let carry = byte;
    for (let i = 0; i < digits.length; i += 1) {
      const value = digits[i] * 256 + carry;
      digits[i] = value % 58;
      carry = Math.floor(value / 58);
    }
    while (carry) {
      digits.push(carry % 58);
      carry = Math.floor(carry / 58);
    }
  }
  let result = "";
  for (const byte of bytes) {
    if (byte === 0) result += "1";
    else break;
  }
  for (let i = digits.length - 1; i >= 0; i -= 1) result += ALPHABET[digits[i]];
  return result;
}

function decodeBase58(value) {
  if (typeof value !== "string") throw new Error("Expected base58 string");
  const bytes = [0];
  for (const char of value) {
    const digit = BASE_MAP.get(char);
    if (digit === undefined) throw new Error(`Invalid base58 character: ${char}`);
    let carry = digit;
    for (let i = 0; i < bytes.length; i += 1) {
      const next = bytes[i] * 58 + carry;
      bytes[i] = next & 0xff;
      carry = next >> 8;
    }
    while (carry) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (const char of value) {
    if (char === "1") bytes.push(0);
    else break;
  }
  return Uint8Array.from(bytes.reverse());
}

function shortvec(number) {
  const bytes = [];
  let value = number;
  do {
    let element = value & 0x7f;
    value >>= 7;
    if (value) element |= 0x80;
    bytes.push(element);
  } while (value);
  return bytes;
}

function concatBytes(chunks) {
  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const output = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    output.set(chunk, offset);
    offset += chunk.length;
  }
  return output;
}

function bytesEqual(a, b) {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
}

function ensureBuffer(value) {
  if (typeof Buffer !== "undefined") return Buffer.isBuffer(value) ? value : Buffer.from(value);
  return Uint8Array.from(value);
}

export class PublicKey {
  constructor(value) {
    const bytes = typeof value === "string" ? decodeBase58(value) : Uint8Array.from(value);
    if (bytes.length !== 32) throw new Error("Invalid public key length");
    this._bytes = bytes;
  }
  toBase58() { return encodeBase58(this._bytes); }
  toBytes() { return Uint8Array.from(this._bytes); }
  equals(other) { return bytesEqual(this._bytes, other.toBytes()); }
}

export class TransactionInstruction {
  constructor({ keys = [], programId, data = new Uint8Array() }) {
    this.keys = keys;
    this.programId = programId;
    this.data = Uint8Array.from(data);
  }
}

export class Transaction {
  constructor() {
    this.instructions = [];
    this.signatures = [];
  }
  add(...items) {
    this.instructions.push(...items);
    return this;
  }
  _compile() {
    if (!this.feePayer) throw new Error("Transaction fee payer required");
    if (!this.recentBlockhash) throw new Error("Transaction recent blockhash required");
    const keys = [this.feePayer];
    for (const instruction of this.instructions) {
      for (const meta of instruction.keys) {
        if (!keys.some((key) => key.equals(meta.pubkey))) keys.push(meta.pubkey);
      }
      if (!keys.some((key) => key.equals(instruction.programId))) keys.push(instruction.programId);
    }
    const programIndexes = this.instructions.map((instruction) => keys.findIndex((key) => key.equals(instruction.programId)));
    const message = concatBytes([
      Uint8Array.from([1, 0, 1]),
      Uint8Array.from(shortvec(keys.length)),
      ...keys.map((key) => key.toBytes()),
      decodeBase58(this.recentBlockhash),
      Uint8Array.from(shortvec(this.instructions.length)),
      ...this.instructions.map((instruction, i) => concatBytes([
        Uint8Array.from([programIndexes[i]]),
        Uint8Array.from(shortvec(instruction.keys.length)),
        Uint8Array.from(instruction.keys.map((meta) => keys.findIndex((key) => key.equals(meta.pubkey)))),
        Uint8Array.from(shortvec(instruction.data.length)),
        instruction.data,
      ])),
    ]);
    return { keys, message };
  }
  serializeMessage() {
    return this._compile().message;
  }
  addSignature(publicKey, signature) {
    const bytes = Uint8Array.from(signature);
    const index = this.signatures.findIndex((item) => item.publicKey.equals(publicKey));
    if (index >= 0) this.signatures[index].signature = bytes;
    else this.signatures.push({ publicKey, signature: bytes });
  }
  serialize(options = {}) {
    const { keys, message } = this._compile();
    const signer = keys[0];
    const found = this.signatures.find((item) => item.publicKey.equals(signer));
    if (options.requireAllSignatures !== false && !found?.signature) {
      throw new Error("Missing required signature");
    }
    const signature = found?.signature ?? new Uint8Array(64);
    return ensureBuffer(concatBytes([Uint8Array.from([1]), signature, message]));
  }
  static from(buffer) {
    const raw = Uint8Array.from(buffer);
    const transaction = new Transaction();
    transaction._raw = raw;
    return transaction;
  }
}

async function rpc(endpoint, method, params = []) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: "praetor", method, params }),
  });
  if (!response.ok) throw new Error(`Solana RPC HTTP ${response.status}`);
  const body = await response.json();
  if (body.error) throw new Error(body.error.message || `Solana RPC ${method} failed`);
  return body.result;
}

export class Connection {
  constructor(endpoint, commitment = "confirmed") {
    this.endpoint = endpoint;
    this.commitment = commitment;
  }
  getHealth() { return rpc(this.endpoint, "getHealth"); }
  getSlot() { return rpc(this.endpoint, "getSlot", [{ commitment: this.commitment }]); }
  getLatestBlockhash() { return rpc(this.endpoint, "getLatestBlockhash", [{ commitment: this.commitment }]).then((r) => r.value); }
  sendRawTransaction(rawTransaction, options = {}) {
    const bytes = Uint8Array.from(rawTransaction);
    const encoded = typeof Buffer !== "undefined" ? Buffer.from(bytes).toString("base64") : btoa(String.fromCharCode(...bytes));
    return rpc(this.endpoint, "sendTransaction", [encoded, { encoding: "base64", skipPreflight: false, preflightCommitment: this.commitment, ...options }]);
  }
  async confirmTransaction(strategyOrSignature, commitment = this.commitment) {
    const signature = typeof strategyOrSignature === "string" ? strategyOrSignature : strategyOrSignature.signature;
    const startedAt = Date.now();
    while (Date.now() - startedAt < 45000) {
      const statuses = await this.getSignatureStatuses([signature]);
      const status = statuses.value?.[0];
      if (status?.err) throw new Error("Solana transaction failed before confirmation");
      if (status?.confirmationStatus === commitment || status?.confirmationStatus === "finalized") {
        return { value: status };
      }
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
    throw new Error("Confirmation timeout while waiting for transaction");
  }
  getSignatureStatuses(signatures) { return rpc(this.endpoint, "getSignatureStatuses", [signatures, { searchTransactionHistory: true }]); }
}

export function clusterApiUrl(cluster) {
  return `https://api.${cluster}.solana.com`;
}
