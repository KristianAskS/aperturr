/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NextResponse } from "next/server";
import { paragraph, user } from "~/server/db/schema";
import { db } from "~/server/db";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { env } from "~/env";

const fetchCurrentUser = async (userId: string) => {
  const [currentUser] = await db
    .select()
    .from(user)
    .where(eq(user.clerkUserId, userId));

  if (!currentUser) {
    throw new Error("Could not find user");
  }
  return currentUser;
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await fetchCurrentUser(userId);
    if (currentUser.email !== env.ADMIN_EMAIL) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { shortId, title, description, maxFines } = body;
    if (!shortId || !title || !description || maxFines === undefined) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const [paragraphModel] = await db
      .select()
      .from(paragraph)
      .where(eq(paragraph.shortId, shortId));
    
    if (!paragraphModel) {
      return NextResponse.json({ message: "Paragraph not found." }, { status: 404 });
    }

    await db.update(paragraph)
      .set({ title, description, maxFines })
      .where(eq(paragraph.shortId, shortId));

    return NextResponse.json({ message: "Paragraph updated successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error updating paragraph:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: (error as Error).message },
      { status: 500 }
    );
  }
}