/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */

import { NextResponse } from "next/server";
import { fine, user, paragraph } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const offset = searchParams.get("offset")
    ? parseInt(searchParams.get("offset") as string, 10)
    : 0;
  const limit = 50;

  try {
    const fines = await db
      .select()
      .from(fine)
      .limit(limit)
      .offset(offset);

    return NextResponse.json(fines, { status: 200 });
  } catch (error) {
    console.error("Error fetching fines:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { offenderClerkId, description, fines, paragraphId, imageUrl } = body;

    if (!offenderClerkId || !description || !fines || !paragraphId) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    if (description.length > 3000) {
      return NextResponse.json({ message: "Description is too long." }, { status: 400 });
    }

    const [offenderUserModel] = await db
      .select()
      .from(user)
      .where(eq(user.clerkUserId, offenderClerkId))
      .limit(1);

    if (!offenderUserModel) {
      return NextResponse.json({ message: "Offender user not found." }, { status: 404 });
    }

    const [issuerUserModel] = await db
      .select()
      .from(user)
      .where(eq(user.clerkUserId, userId))
      .limit(1);

    if (!issuerUserModel) {
      return NextResponse.json({ message: "Issuer user not found." }, { status: 404 });
    }

    const [paragraphModel] = await db
      .select()
      .from(paragraph)
      .where(eq(paragraph.shortId, paragraphId))
      .limit(1);

    if (!paragraphModel) {
      return NextResponse.json({ message: "Paragraph not found." }, { status: 404 });
    }

    await db.insert(fine).values({
      paragraphTitle: paragraphModel.title,
      paragraphShortId: paragraphModel.shortId,
      description: description,
      numFines: Number(fines),
      imageLink: imageUrl ?? null,
      offenderClerkId: offenderUserModel.clerkUserId,
      offenderName: offenderUserModel.username,
      issuerName: issuerUserModel.username,
    });

    return NextResponse.json({ message: "Fine created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error creating fine:", error);
    return NextResponse.json(
      { message: "Internal server error.", error: (error as Error).message },
      { status: 500 }
    );
  }
}