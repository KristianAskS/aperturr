"use client"

import * as React from "react"
import { Badge } from "~/components/ui/badge"

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
    return [...fines].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [fines])

  return (
    <div className="mx-auto w-full max-w-xl p-4 space-y-4">
      <h2 className="text-lg font-semibold text-center">Nyeste Bøter</h2>
      <div className="space-y-2">
        {sortedFines.map((fine) => (
          <div
            key={fine.id}
            className="border border-muted rounded-md p-3 flex items-center justify-between text-sm hover:bg-muted/5 transition-colors"
          >
            <div className="flex flex-col">
              <span className="font-medium">{fine.offenderName}</span>
              <span className="text-xs text-muted-foreground">{formatDate(fine.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base">{fine.numFines}</span>
              <Badge variant="outline">{fine.paragraphTitle}</Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function formatDate(date?: string) {
  if (!date) return "Ukjent dato"

  const dateObject = new Date(date)
  const today = new Date()
  const yesterday = new Date()
  yesterday.setDate(today.getDate() - 1)

  if (
    dateObject.getDate() === today.getDate() &&
    dateObject.getMonth() === today.getMonth() &&
    dateObject.getFullYear() === today.getFullYear()
  ) {
    return `i dag, ${dateObject.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  }

  if (
    dateObject.getDate() === yesterday.getDate() &&
    dateObject.getMonth() === yesterday.getMonth() &&
    dateObject.getFullYear() === yesterday.getFullYear()
  ) {
    return `i går, ${dateObject.toLocaleTimeString("nb-NO", {
      hour: "2-digit",
      minute: "2-digit",
    })}`
  }

  return dateObject.toLocaleDateString("nb-NO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  })
}