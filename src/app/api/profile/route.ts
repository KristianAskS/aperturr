/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const [profile] = await db
      .select()
      .from(user)
      .where(eq(user.clerkUserId, userId))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { message: "Internal server error", error: (error as Error).message },
      { status: 500 }
    );
  }
}