import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ error: "AI services are no longer active." }, { status: 410 });
}
