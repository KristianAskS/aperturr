"use client";

import * as React from "react";
import { Badge } from "~/components/ui/badge";

interface FineType {
  id: number;
  paragraphTitle: string;
  offenderName: string;
  numFines: number;
  paragraphShortId: string;
  description: string;
  date: string;
  issuerName: string;
  imageLink?: string;
}

export default function LatestFineList({ fines }: { fines: FineType[] }) {
  const sortedFines = React.useMemo(() => {
    return [...fines].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [fines]);


  return (
    <div className="mx-auto w-full max-w-xl p-4 space-y-2 px-10">
      <h2 className="text-lg font-semibold mb-2 text-center">Nyeste Bøter</h2>
      {fines.map((fine) => (
        <div
          key={fine.id}
          className="border border-muted rounded-md p-2 flex items-center justify-between text-sm"
        >
          <div className="flex flex-col space-y-1">
            <span className="font-bold">{fine.offenderName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(fine.date)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-base">{fine.numFines}</span>
            <Badge variant="outline">{fine.paragraphTitle}</Badge>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(date?: string) {
  if (!date) return "Ukjent dato";
  const dateObject = new Date(date);
  return dateObject.toLocaleDateString("nb-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
}