import * as React from "react"
import { ParagraphType } from "~/server/db/schema"
import Link from "next/link"

// takes a list of paragraphs described in 
// paragraphs.ts

// and renders a list of paragraphs
// with a link to the fines page
// for each paragraph
// use shadcn

export default function ParagraphList({ paragraphs }: { paragraphs: ParagraphType[] }) {
  return (
    <ul className="flex flex-col gap-4 p-4">
      {paragraphs.map((paragraph) => (
        <li key={paragraph.shortId}>
          <Link
            href={`/fines/${paragraph.shortId}`}
            className="flex items-center gap-3 rounded-md border border-muted p-2 text-sm transition-colors hover:bg-muted/50 dark:border-muted-foreground dark:hover:bg-muted"
          >
            <p className="font-medium">{paragraph.title}</p>
            <p className="text-muted-foreground">{paragraph.description}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}





