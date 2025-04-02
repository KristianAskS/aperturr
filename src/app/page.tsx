/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

export default function HomePage() {
  const { userId } = useAuth();
  const [name, setName] = useState<string | null>(null);

  const [didWait, setDidWait] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDidWait(true), 2000);
    return () => clearTimeout(timer);
  }, []);

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

  if (!userId && !didWait) {
    return null;
  }

  if (!userId && didWait) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-5xl font-bold">Gjør deg til kjenne.</h1>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-5xl font-bold">Aperturr.</h1>
      <div className="text-center py-4" />
      <div className="flex flex-col items-center gap-4">
        <Link href="/fine/create">
          <Button variant="default">Opprett ny bot</Button>
        </Link>
        <Link href="/fines">
          <Button variant="default">Bøter</Button>
        </Link>
        <Link href="admin/paragraph/create">
          <Button variant="default">Opprett en ny paragraf</Button>
        </Link>
        <Link href="admin/paragraph/edit">
          <Button variant="default">Rediger paragrafer</Button>
        </Link>
      </div>
      <Link href="/fine/create" className="fixed bottom-4 right-4 text-3xl ">
        +
      </Link>
    </main>
  );
}