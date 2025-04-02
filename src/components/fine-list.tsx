/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
"use client";

import * as React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
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

export default function FineList({ fines }: { fines: FineType[] }) {
  const [viewMode, setViewMode] = React.useState<"all" | "byOffender">("all");

  // newest first
  const sortedFines = React.useMemo(() => {
    return [...fines].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, [fines]);

  const finesByOffender = React.useMemo(() => {
    const grouped: Record<string, FineType[]> = {};
    for (const fine of sortedFines) {
      if (!fine.offenderName) continue;
      const offender = fine.offenderName;
      if (!grouped[offender]) {
        grouped[offender] = [];
      }
      grouped[offender].push(fine);
    }
    return grouped;
  }, [sortedFines]);

  return (
    <div className="mx-auto w-full max-w-xl p-4">
      <div className="flex justify-center mb-4">
        <div className="inline-flex gap-x-2">
          <button
            onClick={() => setViewMode("all")}
            className={`px-4 py-2 rounded-md border transition-colors min-w-[50px] text-center
              ${
                viewMode === "all"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
          >
            Alle bøter
          </button>
          <button
            onClick={() => setViewMode("byOffender")}
            className={`px-4 py-2 rounded-md border transition-colors min-w-[140px] text-center
              ${
                viewMode === "byOffender"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
              }`}
          >
            Bøter per medlem
          </button>
        </div>
      </div>

      {viewMode === "all" && (
        <Accordion type="multiple" className="w-full space-y-1">
          {sortedFines.map((fine) => (
            <AccordionItem
              key={fine.id}
              value={String(fine.id)}
              className="border border-muted rounded-md"
            >
            <AccordionTrigger className="px-4 py-2 text-left text-sm font-medium">
              <div className="flex items-center space-x-2 md:space-x-4 w-full overflow-hidden">
                <h1 className="text-xl font-bold">{fine.numFines}</h1>
                <div className="text-start break-words w-full">
                  <div className="flex items-center justify-between w-full">
                    <h1 className="text-sm md:text-base font-semibold">
                      {fine.offenderName}
                    </h1>
                    <div className="flex items-center justify-end space-x-1 text-[0.6rem] font-mono text-muted-foreground mr-2.5">
                      Opprettet {formatDate(fine.date)}
                    </div>
                  </div>
                  <h1 className="text-md md:text-sm">{fine.paragraphTitle}</h1>
                </div>
              </div>
              </AccordionTrigger>

              <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground space-y-2">
                <p>{fine.description}</p>

                {fine.imageLink && (
                  <div className="mt-2">
                    <img
                      src={fine.imageLink}
                      alt="Uploaded Fine"
                      className="max-h-60 object-contain rounded-md"
                    />
                  </div>
                )}

                <Badge variant="outline">Meldt av {fine.issuerName}</Badge>
                <p className="text-xs text-muted-foreground">
                  <span className="font-mono">
                  </span>
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {viewMode === "byOffender" && (
        <Accordion type="multiple" className="w-full space-y-2">
          {Object.entries(finesByOffender).map(([offender, offenderFines]) => (
            <AccordionItem
              key={offender}
              value={offender}
              className="border border-muted rounded-md"
            >
              <AccordionTrigger className="px-4 py-2 text-left text-sm font-medium">
                <div className="flex items-center space-x-2">
                  <h1 className="text-base font-semibold">{offender}</h1>
                  <span className="text-sm text-gray-500">
                    ({offenderFines.length} bøter)
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-4 text-sm text-muted-foreground space-y-4">
                {offenderFines.map((fine) => (
                  <div
                    key={fine.id}
                    className="border-b border-muted pb-2 last:border-b-0"
                  >
                    <div className="flex items-center space-x-4 mb-1">
                      <div className="text-2xl font-bold">{fine.numFines}</div>
                      <div>
                        <h2 className="text-sm font-semibold">
                          {fine.paragraphTitle}
                        </h2>
                        <small className="text-xs text-muted-foreground">
                          Opprettet {formatDate(fine.date)}
                        </small>
                      </div>
                    </div>
                    <p>{fine.description}</p>

                    {fine.imageLink && (
                      <div className="my-2">
                        <img
                          src={fine.imageLink}
                          alt="Uploaded Fine"
                          className="max-h-60 object-contain rounded-md"
                        />
                      </div>
                    )}
                    <Badge variant="outline" className="mt-1">
                      Meldt av {fine.issuerName}
                    </Badge>
                  </div>
                ))}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
}

const formatDate = (date?: string) => {
  if (!date) return "Ukjent dato";
  const dateObject = new Date(date);
  return dateObject.toLocaleDateString("nb-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
};