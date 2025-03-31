/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { ParagraphType } from "~/server/db/schema";

export default function EditParagraph() {
  const { userId } = useAuth();

  const [paragraphName, setParagraphName] = useState("");
  const [paragraphDescription, setParagraphDescription] = useState("");
  const [maxFines, setMaxFines] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [paragraphs, setParagraphs] = useState<ParagraphType[]>([]);
  const [selectedParagraph, setSelectedParagraph] = useState<ParagraphType | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/paragraph");
        if (!res.ok) {
          throw new Error(`Failed to fetch paragraphs. Status: ${res.status}`);
        }
        const data = await res.json();
        const fetchedParagraphs = data.message ?? data;
        setParagraphs(fetchedParagraphs);
        if (fetchedParagraphs.length > 0) {
          const first = fetchedParagraphs[0];
          setSelectedParagraph(first);
          setParagraphName(first.title);
          setParagraphDescription(first.description);
          setMaxFines(first.maxFines.toString());
        }
      } catch (err: any) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div></div>;
  }

  if (!userId) {
    return <div></div>;
  }

  const handleParagraphSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedShortId = e.target.value;
    const paragraph = paragraphs.find(p => p.shortId === selectedShortId);
    if (paragraph) {
      setSelectedParagraph(paragraph);
      setParagraphName(paragraph.title);
      setParagraphDescription(paragraph.description);
      setMaxFines(paragraph.maxFines.toString());
    }
  };

  const handleParagraphUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!selectedParagraph) {
      setErrorMessage("No paragraph selected for updating.");
      return;
    }

    if (!paragraphName || !paragraphDescription || !maxFines) {
      setErrorMessage("All fields must be filled out.");
      return;
    }

    const parsedMaxFines = parseInt(maxFines, 10);
    if (isNaN(parsedMaxFines)) {
      setErrorMessage("Max fines must be a valid number.");
      return;
    }

    try {
      const response = await fetch("/api/paragraph/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shortId: selectedParagraph.shortId,
          title: paragraphName,
          description: paragraphDescription,
          maxFines: parsedMaxFines,
        }),
      });
      if (!response.ok) {
        throw new Error("Error updating paragraph");
      }
      setSuccessMessage("Paragraph updated successfully!");
    } catch (error: any) {
      console.error("Failed to update paragraph:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        Back
      </Link>
      <h1 className="text-4xl font-bold mb-4">Edit Paragraph</h1>
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      
      <div className="mb-4">
        <Label htmlFor="paragraphSelect" className="mb-1">
          Select Paragraph to Edit
        </Label>
        <select
          id="paragraphSelect"
          value={selectedParagraph?.shortId ?? ""}
          onChange={handleParagraphSelect}
          className="border rounded px-2 py-1 w-full"
        >
          {paragraphs.map(paragraph => (
            <option key={paragraph.shortId} value={paragraph.shortId}>
              {paragraph.title}
            </option>
          ))}
        </select>
      </div>

      {selectedParagraph && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Current Paragraph Preview</h2>
          <p>
            <strong>Title:</strong> {selectedParagraph.title}
          </p>
          <p>
            <strong>Description:</strong> {selectedParagraph.description}
          </p>
          <p>
            <strong>Max Fines:</strong> {selectedParagraph.maxFines}
          </p>
        </div>
      )}

      <form onSubmit={handleParagraphUpdateSubmit} className="space-y-4">
        <div>
          <Label htmlFor="paragraphName" className="mb-1">
            Paragraph Name
          </Label>
          <Input
            id="paragraphName"
            type="text"
            value={paragraphName}
            onChange={(e) => setParagraphName(e.target.value)}
            placeholder="Enter paragraph name"
            required
          />
        </div>
        <div>
          <Label htmlFor="paragraphDescription" className="mb-1">
            Description
          </Label>
          <Textarea
            id="paragraphDescription"
            value={paragraphDescription}
            onChange={(e) => setParagraphDescription(e.target.value)}
            placeholder="Enter description"
            required
            className="h-24"
          />
        </div>
        <div>
          <Label htmlFor="maxFines" className="mb-1">
            Max Fines
          </Label>
          <Input
            id="maxFines"
            type="number"
            value={maxFines}
            onChange={(e) => setMaxFines(e.target.value)}
            placeholder="Enter max fines"
            required
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <Button type="submit" className="w-full">
          Update Paragraph
        </Button>
      </form>
    </div>
  );
}