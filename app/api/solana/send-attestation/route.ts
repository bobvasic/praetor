import { NextRequest, NextResponse } from "next/server";
import { getExplorerTxUrl, PRAETOR_INCIDENT_ID } from "@/lib/solana/constants";
import { cleanSolanaError, createQuickNodeConnection } from "@/lib/solana/server";

export const dynamic = "force-dynamic";

type SendAttestationBody = {
  signedTransaction?: unknown;
  incidentId?: unknown;
};

async function readBody(request: NextRequest): Promise<SendAttestationBody> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function waitForConfirmedSignature(connection: ReturnType<typeof createQuickNodeConnection>, signature: string) {
  const startedAt = Date.now();
  const timeoutMs = 45_000;

  while (Date.now() - startedAt < timeoutMs) {
    const statuses = await connection.getSignatureStatuses([signature]);
    const status = statuses.value[0] as { confirmationStatus?: string; err?: unknown } | null;

    if (status?.err) {
      throw new Error("Solana transaction failed before confirmation");
    }

    if (status?.confirmationStatus === "confirmed" || status?.confirmationStatus === "finalized") {
      return status.confirmationStatus;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_500));
  }

  throw new Error("Confirmation timeout while waiting for devnet attestation");
}

export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);

    if (body.incidentId !== PRAETOR_INCIDENT_ID) {
      return NextResponse.json(
        { ok: false, error: "Invalid or missing Praetor incidentId" },
        { status: 400 },
      );
    }

    if (typeof body.signedTransaction !== "string" || body.signedTransaction.length < 32) {
      return NextResponse.json(
        { ok: false, error: "signedTransaction must be a base64 encoded signed Solana transaction" },
        { status: 400 },
      );
    }

    const signedTransaction = Buffer.from(body.signedTransaction, "base64");
    const connection = createQuickNodeConnection();
    const signature = await connection.sendRawTransaction(signedTransaction, {
      maxRetries: 3,
    });

    await connection.confirmTransaction(signature, "confirmed");
    const status = await waitForConfirmedSignature(connection, signature);

    return NextResponse.json({
      ok: true,
      signature,
      explorerUrl: getExplorerTxUrl(signature),
      status,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: cleanSolanaError(error) },
      { status: 502 },
    );
  }
}
