/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { useAuth } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { CreateFineForm } from "~/components/create-fine-form";
import { ParagraphType } from "~/server/db/schema";

export default function Create() {
  const { userId } = useAuth();

  const [paragraphs, setParagraphs] = useState<ParagraphType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState<boolean>(false);

  useEffect(() => {
    // If no user is logged in, wait 1 second before showing the message.
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
        // data.message is the array of paragraphs
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
    // Further logic to create a fine goes here...
  };

  // If not logged in, show a delayed message.
  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-3xl font-bold">Create Fine</h1>
        {showLoginPrompt ? (
          <p>You haven't logged in. Please log in to fetch and create fines.</p>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-3xl font-bold">Create Fine</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <CreateFineForm onCreateFine={onCreateFine} paragraphs={paragraphs} />
      )}
    </div>
  );
}