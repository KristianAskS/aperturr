/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState, useRef } from "react";

import { uploadFiles } from "~/utils/uploadthing";

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

import { ParagraphType } from "~/server/db/schema";

interface FineFormData {
  offenderClerkId: string;
  description: string;
  fines: number;
  paragraphId: string;
  imageUrl?: string;
}

// Props for your form
export type CreateFineFormProps = {
  onCreateFine: (fine: FineFormData) => void;
  paragraphs: ParagraphType[];
  clerkIdUsernamePairs: [string, string][];
};

export function CreateFineForm({
  onCreateFine,
  paragraphs,
  clerkIdUsernamePairs,
}: CreateFineFormProps) {
  const [offender, setOffender] = useState("");
  const [description, setDescription] = useState("");
  const [fines, setFines] = useState("");
  const [paragraph, setParagraph] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const parsedFines = parseInt(fines, 10);
    if (!offender || !description || !paragraph || !fines || isNaN(parsedFines)) {
      return;
    }

    const formData: FineFormData = {
      offenderClerkId: offender,
      description,
      fines: parsedFines,
      paragraphId: paragraph,
    };

    if (selectedFile) {
      try {
        const response = await uploadFiles("imageUploader", {
          files: [selectedFile],
          // Optional callbacks:
          onUploadBegin: ({ file }) => {
            console.log("Starting upload for:", file);
          },
          onUploadProgress: ({ file, progress }) => {
            // For large uploads, you can show progress
            console.log("Uploading:", file.name, "Progress:", progress);
          },
        });

        const uploadedFile = response[0];
        if (uploadedFile) {
          formData.imageUrl = uploadedFile.url;
        }
      } catch (err) {
        console.error("UploadThing error:", err);
      }
    }

    onCreateFine(formData);

    setOffender("");
    setDescription("");
    setFines("");
    setParagraph("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleResetImage = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Link
        href="/"
        className="flex items-center text-blue-500 hover:underline mb-4 font-bold"
      >
        <ArrowLeft className="mr-2" />
        Tilbake
      </Link>

      <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg shadow-md p-4 text-3xl">
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
                {clerkIdUsernamePairs.map(([clerkId, username]) => (
                  <SelectItem key={clerkId} value={clerkId}>
                    {username}
                  </SelectItem>
                ))}
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

        <div>
          <Label htmlFor="fines" className="mb-2 block">
            Antall bøter
          </Label>
          <Input
            id="fines"
            type="number"
            required
            value={fines}
            onChange={(e) => setFines(e.target.value)}
            placeholder="Antall bøter"
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />
            {selectedFile && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleResetImage}
              >
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