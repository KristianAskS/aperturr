/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { NextResponse } from "next/server";
import { fine } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset") as string, 10) : 0;
    const limit = 50;
    
    try {
        const fines = await db
        .select()
        .from(fine)
        .limit(limit)
        .offset(offset);
    
        return NextResponse.json(fines, { status: 200 });
    } catch (error) {
        console.error("Error fetching paragraphs:", error);
        return NextResponse.json({ message: "Internal server error.", error: (error as Error).message }, { status: 500 });
    }
}