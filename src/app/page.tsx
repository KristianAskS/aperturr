/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { UploadButton } from "~/utils/uploadthing";

export default function HomePage() {
  const { userId } = useAuth();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();

        if (res.ok) {
          setName(data.username);
        } else {
          console.error("Failed to fetch profile:", data.message);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-3xl font-bold">
        {name ? `Halla, ${name}.` : "Hello"}
      </h1>

      {userId && (
        <Link href="/create">
          <Button variant="default">Opprett ny bot</Button>
        </Link>
      )}
      {userId && (
        <Link href={"/fines"}>
          <Button variant="default">Bøter</Button>
        </Link>
      )}

      {/* <UploadButton endpoint="imageUploader" /> */}
    </main>
  );
}