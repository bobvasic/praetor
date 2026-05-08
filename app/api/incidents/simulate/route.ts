import { NextResponse } from "next/server";
import { createDemoIncident } from "@/lib/demo-data";

function simulatedIncidentResponse() {
  return NextResponse.json({
    ok: true,
    incident: createDemoIncident(),
  });
}

export async function GET() {
  return simulatedIncidentResponse();
}

export async function POST() {
  return simulatedIncidentResponse();
}
