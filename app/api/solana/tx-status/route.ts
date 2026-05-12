import { NextRequest, NextResponse } from "next/server";
import { SOLANA_MEMO_PROGRAM_ID } from "@/lib/solana/constants";
import { cleanSolanaError, createQuickNodeConnection } from "@/lib/solana/server";

export const dynamic = "force-dynamic";

function getInstructionProgramId(instruction: unknown) {
  if (!instruction || typeof instruction !== "object" || !("programId" in instruction)) {
    return null;
  }

  const programId = (instruction as { programId?: unknown }).programId;
  if (!programId) return null;
  return typeof programId === "string"
    ? programId
    : typeof (programId as { toBase58?: unknown }).toBase58 === "function"
      ? (programId as { toBase58(): string }).toBase58()
      : null;
}

function getMemoText(instruction: unknown) {
  if (!instruction || typeof instruction !== "object" || !("parsed" in instruction)) {
    return null;
  }

  const parsed = (instruction as { parsed?: unknown }).parsed;
  if (typeof parsed === "string") return parsed;
  if (!parsed || typeof parsed !== "object") return null;

  const parsedObject = parsed as { memo?: unknown; info?: { memo?: unknown } };
  if (typeof parsedObject.memo === "string") return parsedObject.memo;
  if (typeof parsedObject.info?.memo === "string") return parsedObject.info.memo;
  return null;
}

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
    const { value } = await connection.getSignatureStatuses([signature], {
      searchTransactionHistory: true,
    });
    const status = value[0] as
      | { confirmationStatus?: string; slot?: number; err?: unknown }
      | null;

    const parsedTransaction = status
      ? await connection.getParsedTransaction(signature, {
          commitment: "confirmed",
          maxSupportedTransactionVersion: 0,
        })
      : null;
    const memoText =
      parsedTransaction?.transaction.message.instructions
        .map((instruction) =>
          getInstructionProgramId(instruction) === SOLANA_MEMO_PROGRAM_ID
            ? getMemoText(instruction)
            : null,
        )
        .find((memo): memo is string => Boolean(memo)) ?? null;

    let memoPayload: unknown = null;
    if (memoText) {
      try {
        memoPayload = JSON.parse(memoText);
      } catch {
        memoPayload = memoText;
      }
    }

    return NextResponse.json({
      ok: true,
      signature,
      confirmationStatus: status?.confirmationStatus ?? null,
      slot: status?.slot ?? null,
      err: status?.err ?? null,
      memoText,
      memoPayload,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: cleanSolanaError(error) },
      { status: 502 },
    );
  }
}
