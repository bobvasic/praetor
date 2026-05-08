import { NextResponse } from "next/server";
import { demoIncident } from "@/lib/demo-data";

export async function POST() {
  return NextResponse.json({
    riskScore: demoIncident.riskScore,
    riskLevel: demoIncident.riskLevel,
    actionType: demoIncident.actionType,
    status: demoIncident.status,
    reasons: demoIncident.reasons,
  });
}
