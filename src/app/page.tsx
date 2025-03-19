/* eslint-disable @typescript-eslint/no-unsafe-call */
import Link from "next/link";
import { db } from "~/server/db";
import { paragraph, fine, user } from "~/server/db/schema";
import { sql } from "drizzle-orm";

export default async function HomePage() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      Hello world.
      <div>
      </div>
    </main>
  );
}
