/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/non-nullable-type-assertion-style */
import { NextResponse } from "next/server";
import { paragraph } from "~/server/db/schema";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { user } from "~/server/db/schema";
import { env } from "~/env";

const generateShortId = () => {
  return Math.random().toString(36).substring(2, 8);
};

export async function POST(req: Request) {
   try {
     const { userId } = await auth();
     if (!userId) {
       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
     }
    const body = await req.json();
    const { title, description, maxFines } = body;

    const [currentUser] = await db.select().from(user).where(eq(user.clerkUserId, userId));

    if (!currentUser) {
      return NextResponse.json({ message: "Could not find user" }, { status: 401 });
    }

    if (currentUser.email !== env.ADMIN_EMAIL) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (!title || !description || !maxFines) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    let shortId = generateShortId();

    let existingParagraph = await db
      .select()
      .from(paragraph)
      .where(eq(paragraph.shortId, shortId));


    while (existingParagraph.length > 0) {
      shortId = generateShortId();
      existingParagraph = await db
        .select()
        .from(paragraph)
        .where(eq(paragraph.shortId, shortId));
    }

    await db.insert(paragraph).values({
      title,
      description,
      maxFines,
      shortId: shortId,
    })

    return NextResponse.json({ message: "Paragraph created successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error creating paragraph:", error);
    return NextResponse.json({ message: "Internal server error.", error: (error as Error).message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }


  const { searchParams } = new URL(req.url);
  const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset") as string, 10) : 0;
  const limit = 50;

  try {
    const paragraphs = await db
    .query.paragraph.findMany({orderBy: (model, { desc }) => desc(model.id)})

    if (paragraphs.length === 0) {
      return NextResponse.json({ message: "No paragraphs found." }, { status: 404 });
    }

    return NextResponse.json({ message: paragraphs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching paragraphs:", error);
    return NextResponse.json({ message: "Internal server error.", error: (error as Error).message }, { status: 500 });
  }
}
