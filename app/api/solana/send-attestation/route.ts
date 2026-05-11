import { NextRequest, NextResponse } from "next/server";
import { getExplorerTxUrl, PRAETOR_INCIDENT_ID } from "@/lib/solana/constants";
import { cleanSolanaError, createQuickNodeConnection } from "@/lib/solana/server";

export const dynamic = "force-dynamic";

type SendAttestationBody = {
  signedTransaction?: unknown;
  incidentId?: unknown;
  privateKey?: unknown;
  secretKey?: unknown;
  keypair?: unknown;
};

async function readBody(request: NextRequest): Promise<SendAttestationBody> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function decodeBase64Transaction(value: string) {
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(value) || value.length % 4 === 1) {
    return null;
  }

  const transaction = Buffer.from(value, "base64");
  return transaction.length >= 32 ? transaction : null;
}

async function pollSignatureStatus(connection: ReturnType<typeof createQuickNodeConnection>, signature: string) {
  // Keep total wait under platform gateway timeout (DO/Cloudflare ~60s).
  const startedAt = Date.now();
  const timeoutMs = 12_000;

  while (Date.now() - startedAt < timeoutMs) {
    const statuses = await connection.getSignatureStatuses([signature]);
    const status = statuses.value[0] as { confirmationStatus?: string; err?: unknown } | null;

    if (status?.err) {
      throw new Error("Solana transaction failed before confirmation");
    }

    if (status?.confirmationStatus === "confirmed" || status?.confirmationStatus === "finalized") {
      return status.confirmationStatus;
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
  }

  // Not confirmed within the budget. Return a soft status so the client gets
  // the signature + Explorer link and can verify directly.
  return "submitted";
}

export async function POST(request: NextRequest) {
  try {
    const body = await readBody(request);

    if ("privateKey" in body || "secretKey" in body || "keypair" in body) {
      return NextResponse.json(
        { ok: false, error: "Private keys are never accepted. Sign with a wallet client-side and submit only signedTransaction." },
        { status: 400 },
      );
    }

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

    const signedTransaction = decodeBase64Transaction(body.signedTransaction);
    if (!signedTransaction) {
      return NextResponse.json(
        { ok: false, error: "signedTransaction must be valid base64 signed transaction bytes" },
        { status: 400 },
      );
    }
    const connection = createQuickNodeConnection();
    const signature = await connection.sendRawTransaction(signedTransaction, {
      maxRetries: 3,
    });

    // Return immediately to stay under the DO/Cloudflare gateway timeout (~60s).
    // The signature + Explorer URL is enough for the client to verify confirmation
    // itself; polling here was the cause of the upstream 504 → HTML response that
    // tripped the client's JSON parser.
    const status = "submitted";

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
