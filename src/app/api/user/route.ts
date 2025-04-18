/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { user } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
    const { userId } = await auth();

    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("ClerkId");

    if (!clerkId) return NextResponse.json({ message: "ClerkId not found" }, { status: 400 });

    try {
        const [profile] = await db
        .select()
        .from(user)
        .where(eq(user.clerkUserId, clerkId));
    
        if (!profile) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(profile);

    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}