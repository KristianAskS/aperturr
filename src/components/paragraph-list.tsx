import * as React from "react";
import { ParagraphType } from "~/server/db/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";

export default function ParagraphList({ paragraphs }: { paragraphs: ParagraphType[] }) {
  return (
    <div className="mx-auto w-full max-w-xl  p-4">
      <Accordion type="multiple" className="w-full space-y-1">
        {paragraphs.map((paragraph) => (
          <AccordionItem
            key={paragraph.shortId}
            value={paragraph.shortId}
            className="border border-muted rounded-md"
          >
            <AccordionTrigger className="px-4 py-2 text-left text-sm font-medium">
              {paragraph.title}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 text-sm text-muted-foreground space-y-2">
              <p>{paragraph.description}</p>
              <Badge variant="outline">Maks bøter: {paragraph.maxFines}</Badge>
              <p className="text-xs text-muted-foreground">
                Paragraf-ID: <span className="font-mono">{paragraph.shortId}</span>
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}