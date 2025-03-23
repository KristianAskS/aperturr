/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/app/api/webhooks/clerk/route.ts
import { Webhook, WebhookRequiredHeaders } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '~/server/db';
import { user } from '~/server/db/schema';
import { eq } from 'drizzle-orm';

const webhookSecret = "";

export async function POST(request: Request) {
  const payload = await request.json();
  const headerPayload = await headers();

  const svixHeaders: WebhookRequiredHeaders = {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
    'svix-signature': headerPayload.get('svix-signature')!,
  };

  const wh = new Webhook(webhookSecret);

  let evt;
  try {
    evt = wh.verify(JSON.stringify(payload), svixHeaders) as any;
  } catch (err) {
    return NextResponse.json({ message: 'Invalid webhook signature' }, { status: 400 });
  }

  if (evt.type === 'user.created') {
    const clerkUser = evt.data;

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, clerkUser.email_addresses[0].email_address));

    // Only create if this user doesn't exist yet
    if (existingUser.length === 0) {
      const firstName = clerkUser.first_name;
      const lastName = clerkUser.last_name;

      let username = "Unnamed";
      if (firstName && lastName) {
        username = `${firstName} ${lastName}`;
      } else if (firstName && !lastName) {
        username = firstName;
      } else if (!firstName && lastName) {
        username = lastName;
      } else if (clerkUser.username) {
        username = clerkUser.username;
      }

      await db.insert(user).values({
        username,
        email: clerkUser.email_addresses[0].email_address,
        clerkUserId: clerkUser.id,
        profilePicture: clerkUser.profile_image_url,
      });
    }
  }

  return NextResponse.json({ success: true });
}