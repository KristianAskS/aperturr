// src/app/api/test/route.ts
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";

export async function GET() {
  try {
    const allUsers = await db.select().from(user);

    return NextResponse.json({ data: allUsers });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 });
  }
}
