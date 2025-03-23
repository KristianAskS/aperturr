/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/fines/page.tsx
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import FineList from "~/components/fine-list";

export default function FinesPage() {
  const [fines, setFines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFines = async () => {
      try {
        const res = await fetch("/api/fine");
        if (!res.ok) {
          throw new Error(`Failed to fetch fines. Status: ${res.status}`);
        }
        const data = await res.json();
        setFines(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFines();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="p-4 text-red-500">Feil: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="text-center mb-1">
        <h1 className="text-6xl font-bold">Bøter</h1>
      </header>

      <Link
        href="/"
        className="flex items-center text-blue-500 hover:underline mb-4 font-bold"
      >
        <ArrowLeft className="mr-2" />
        Tilbake
      </Link>

      {fines.length === 0 ? (
        <p>Ingen bøter funnet.</p>
      ) : (
        <FineList fines={fines} />
      )}
    </div>
  );
}