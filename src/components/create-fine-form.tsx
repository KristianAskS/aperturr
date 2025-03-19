"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";

// Drizzle paragraph type
import { ParagraphType } from "~/server/db/schema";

// UI imports
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Form shape
interface FineFormData {
  offender: string;
  description: string;
  fines: number;
  paragraph: string; // shortId from the paragraphs
  image: File | null;
}

export type CreateFineFormProps = {
  onCreateFine: (fine: FineFormData) => void;
  paragraphs: ParagraphType[];
};

export function CreateFineForm({ onCreateFine, paragraphs }: CreateFineFormProps) {
  const [offender, setOffender] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fines, setFines] = useState<number>(1);
  const [paragraph, setParagraph] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (offender && description && fines && paragraph) {
      const formData: FineFormData = {
        offender,
        description,
        fines,
        paragraph,
        image,
      };
      onCreateFine(formData);

      // Reset fields
      setOffender("");
      setDescription("");
      setFines(1);
      setParagraph("");
      setImage(null);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleResetImage = () => {
    setImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link href="/" className="flex items-center text-blue-500 hover:underline mb-4">
        <ArrowLeft className="mr-2" />
        Tilbake
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg shadow-md p-4">
        <div className="flex space-x-4">
          {/* Offender */}
          <div className="flex-1">
            <Label htmlFor="offender" className="mb-2 block">
              Tiltalte
            </Label>
            <Select value={offender} onValueChange={setOffender} required>
              <SelectTrigger>
                <SelectValue placeholder="Velg den tiltalte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ola_nordmann">Ola Nordmann</SelectItem>
                <SelectItem value="kari_nordmann">Kari Nordmann</SelectItem>
                <SelectItem value="per_olsen">Per Olsen</SelectItem>
                <SelectItem value="nina_hansen">Nina Hansen</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Paragraph / Lovbrudd */}
          <div className="flex-1">
            <Label htmlFor="paragraph" className="mb-2 block">
              Lovbrudd
            </Label>
            <Select value={paragraph} onValueChange={setParagraph} required>
              <SelectTrigger>
                <SelectValue placeholder="Velg lovbrudd" />
              </SelectTrigger>
              <SelectContent>
                {paragraphs.map((p) => (
                  <SelectItem key={p.shortId} value={p.shortId}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description" className="mb-2 block">
            Beskrivelse
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beskriv hva som skjedde"
            required
            className="h-20"
          />
        </div>

        {/* Number of Fines */}
        <div>
          <Label htmlFor="fines" className="mb-2 block">
            Antall bøter
          </Label>
          <Input
            id="fines"
            type="number"
            value={fines}
            onChange={(e) => setFines(Number(e.target.value))}
            placeholder="Antall bøter"
            min={1}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label htmlFor="image" className="mb-2 block">
            Bilde (valgfri)
          </Label>
          <div className="flex items-center space-x-4">
            <Input
              id="image"
              type="file"
              ref={inputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setImage(e.target.files[0]);
                }
              }}
            />
            {image && (
              <Button type="button" variant="destructive" onClick={handleResetImage}>
                Nullstill bilde
              </Button>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Opprett bot
        </Button>
      </form>
    </div>
  );
}