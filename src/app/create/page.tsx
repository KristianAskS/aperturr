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

  useEffect(() => {
    // If no userId is found, show a login prompt after a short timeout
    if (!userId) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    // Otherwise, fetch paragraphs and usernames
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

  // todo fix the form shit
  const onCreateFine = async (FineForm: any) => {
    const { offenderClerkId, description, fines, paragraphId, image } = FineForm;
    // send a post to /api/fine
    console.log("Fine data:", FineForm);
    // Logic to send fine data to API...
    const res = await fetch("/api/fine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        offenderClerkId,
        description,
        fines,
        paragraphId,
        image,
      }),
    });

    console.log(res);

  };

  // If user is not logged in, show a "loading/spinner" or a prompt
  if (!userId)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-2">
        <p className="text-lg text-2xl">Laster...</p>
        {showLoginPrompt && <p>Vennligst logg inn for å opprette bøter.</p>}
      </div>
    );

  return (
    <div className="container mx-auto max-w-5xl py-1 px-1">
      <header className="text-center mb-1">
        <h1 className="text-6xl font-bold">Opprett bot</h1>
        <p>Fyll ut malen for å registrere ny bot</p>
      </header>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : (
        <section className="rounded-lg">
          <CreateFineForm
            onCreateFine={onCreateFine}
            paragraphs={paragraphs}
            clerkIdUsernamePairs={clerkIdUsernamePairs}
          />
        </section>
      )}

      <hr className="border-b border-muted/40 padding-10 mb-8" />

      {loading ? (
        <p className="text-center">Laster...</p>
      ) : (
        <>
          <h2 className="text-4xl font-semibold mb-8 text-center">Paragrafer</h2>
          <ParagraphList paragraphs={paragraphs} />
        </>
      )}
    </div>
  );
}