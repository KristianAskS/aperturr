/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { UploadButton } from "~/utils/uploadthing";

export default function HomePage() {
  const { userId } = useAuth();


  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Hello {userId}</h1>

      {/* Show button only if user is logged in */}
      {userId && (
        <Link href="/create">
          <Button variant="default">Opprett ny bot</Button>
        </Link>

      )}
      <UploadButton
        endpoint="imageUploader"></UploadButton>
    
    <div>
    </div>
    </main>
  );
}