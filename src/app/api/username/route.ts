/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { NextResponse } from "next/server";
import { paragraph } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { user } from "~/server/db/schema";

// return a list of usernames
export async function GET(req: Request) {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const users = await db.query.user.findMany({orderBy: (model, { desc }) => desc(model.id)})

    const usernames = users.map((user) => [user.clerkUserId, user.username]);

    return NextResponse.json({message : usernames}, {status: 200});
}
        