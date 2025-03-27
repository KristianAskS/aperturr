"use client";

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

export default function CreateParagraph() {
  const { userId } = useAuth();

  const [paragraphName, setParagraphName] = useState("");
  const [paragraphDescription, setParagraphDescription] = useState("");
  // Changed maxFines state to string so it can be empty initially
  const [maxFines, setMaxFines] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    // Wait a moment (e.g., for auth/user data) before rendering the form
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [userId]);

  if (loading) {
    return null;
  }

  if (!userId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    // Simple validation check
    if (!paragraphName || !paragraphDescription || !maxFines) {
      setErrorMessage("Alle felt må fylles ut.");
      return;
    }

    const parsedMaxFines = parseInt(maxFines, 10);
    if (isNaN(parsedMaxFines)) {
      setErrorMessage("Maks antall bøter må være et tall.");
      return;
    }

    try {
      const response = await fetch("/api/paragraph", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: paragraphName,
          description: paragraphDescription,
          maxFines: parsedMaxFines,
        }),
      });

      if (!response.ok) {
        throw new Error("Error creating paragraph");
      }

      setSuccessMessage("Paragraf opprettet!");
      // Clear form fields
      setParagraphName("");
      setParagraphDescription("");
      setMaxFines("");
    } catch (error) {
      console.error("Failed to create paragraph:", error);
      setErrorMessage("Noe gikk galt. Prøv igjen.");
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <Link href="/" className="text-blue-500 hover:underline mb-4 block">
        Tilbake
      </Link>
      <h1 className="text-4xl font-bold mb-4">Opprett paragraf</h1>
      {successMessage && (
        <p className="text-green-500 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="paragraphName" className="mb-1">
            Paragrafnavn
          </Label>
          <Input
            id="paragraphName"
            type="text"
            value={paragraphName}
            onChange={(e) => setParagraphName(e.target.value)}
            placeholder="Skriv paragrafnavn"
            required
          />
        </div>
        <div>
          <Label htmlFor="paragraphDescription" className="mb-1">
            Beskrivelse
          </Label>
          <Textarea
            id="paragraphDescription"
            value={paragraphDescription}
            onChange={(e) => setParagraphDescription(e.target.value)}
            placeholder="Skriv beskrivelse"
            required
            className="h-24"
          />
        </div>
        <div>
          <Label htmlFor="maxFines" className="mb-1">
            Maks antall bøter
          </Label>
          <Input
            id="maxFines"
            type="number"
            value={maxFines}
            onChange={(e) => setMaxFines(e.target.value)}
            placeholder="Angi antall bøter"
            required
            className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>
        <Button type="submit" className="w-full">
          Opprett paragraf
        </Button>
      </form>
    </div>
  );
}