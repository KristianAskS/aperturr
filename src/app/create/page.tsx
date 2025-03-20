/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      const timer = setTimeout(() => {
        setShowLoginPrompt(true);
        setLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }

    const fetchParagraphs = async () => {
      try {
        const res = await fetch("/api/paragraph");
        const data = await res.json();
        if (data.message === "Error fetching paragraphs") {
          console.error("Error fetching paragraphs");
          return;
        }
        setParagraphs(data.message);
        console.log(data);
      } catch (error) {
        console.error("Failed to fetch paragraphs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchParagraphs();
  }, [userId]);

  const onCreateFine = async (fine: any) => {
    console.log("Skidibi", fine);
    // Logic to send fine data to API...
  };

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen  p-6">
        <h1 className="text-4xl font-bold ">Create Fine</h1>
        {showLoginPrompt ? (
          <p className="text-lg ">
            You haven't logged in. Please log in to fetch and create fines.
          </p>
        ) : (
          <p className="text-lg ">Loading...</p>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-10 px-6  shadow-lg rounded-lg">
      <header className="text-center mb-6">
        <h1 className="text-4xl font-bold ">Create Fine</h1>
        <p className="">Fill out the form below to register a fine.</p>
      </header>

      {loading ? (
        <p className="text-center text-lg ">Loading...</p>
      ) : (
        <section className=" p-6 rounded-lg shadow-md">
          <CreateFineForm onCreateFine={onCreateFine} paragraphs={paragraphs} />
        </section>
      )}
      <hr className="border-b border-muted/40 padding-10 mb-8" />
      <h2 className="text-2xl font-semibold mb-8 text-center">Paragrafer</h2>
      {loading ? <p className="text-center">Laster...</p> : <ParagraphList paragraphs={paragraphs} />}
    </div>
  );
}