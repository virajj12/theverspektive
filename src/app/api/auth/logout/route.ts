export const runtime = 'edge';

import { getUserSession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE() {
  const session = await getUserSession();
  session.destroy();
  return NextResponse.json({ success: true });
}
