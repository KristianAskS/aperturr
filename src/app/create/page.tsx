/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { CreateFineForm } from "~/components/create-fine-form";
import ParagraphList from "~/components/paragraph-list";
import { ParagraphType } from "~/server/db/schema";

export default function Create() {
  const { userId } = useAuth();
  const [paragraphs, setParagraphs] = useState<ParagraphType[]>([]);
  const [clerkIdUsernamePairs, setClerkIdUsernamePairs] = useState<[string, string][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  useEffect(() => {
    if (!userId) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [paragraphRes, usernamesRes] = await Promise.all([
          fetch("/api/paragraph"),
          fetch("/api/username"),
        ]);

        const paragraphData = await paragraphRes.json();
        if (paragraphData.message === "Error fetching paragraphs") {
          console.error("Error fetching paragraphs");
        } else {
          setParagraphs(paragraphData.message);
        }

        const usernamesData = await usernamesRes.json();
        if (usernamesData.message === "Error fetching usernames") {
          console.error("Error fetching usernames");
        } else {
          setClerkIdUsernamePairs(usernamesData.message);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const onCreateFine = async (fineFormData: {
    offenderClerkId: string;
    description: string;
    fines: number;
    paragraphId: string;
    imageUrl?: string;
  }) => {
    setSuccessMessage("");
    try {
      const response = await fetch("/api/fine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fineFormData),
      });
  
      if (!response.ok) {
        throw new Error("Error creating fine");
      }
  
      setSuccessMessage("Boten ble opprettet!");
      return true;
    } catch (error) {
      console.error("Failed to create fine:", error);
      return false;
    }
  };

  if (loading) {
    return (
      <div className="">
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-2">
        {showLoginPrompt && <p>Vennligst logg inn for å opprette bøter.</p>}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl py-1 px-1">
      <header className="text-center mb-1">
        <h1 className="text-5xl font-bold py-1">Opprett bot</h1>
        <p className="text-sm">Fyll ut malen for å registrere ny bot</p>
      </header>

      <section className="rounded-lg ">

        <CreateFineForm
          onCreateFine={onCreateFine}
          paragraphs={paragraphs}
          clerkIdUsernamePairs={clerkIdUsernamePairs}
        />
      </section>

      <hr className="border-b border-muted/40 padding-10 mb-8" />

      <h2 className="text-4xl font-semibold mb-8 text-center">Paragrafer</h2>
      <ParagraphList paragraphs={paragraphs} />
    </div>
  );
}