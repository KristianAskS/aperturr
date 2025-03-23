/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// app/fines/page.tsx
"use client";

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
    return <p className="p-4">Laster bøter...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">Feil: {error}</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold">Bøter</h1>
      {fines.length === 0 ? (
        <p>Ingen bøter funnet.</p>
      ) : (
        <FineList fines={fines} />
      )}
    </div>
  );
}