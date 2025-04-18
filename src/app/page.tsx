/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
"use client"

import Link from "next/link"
import {
  ClerkLoaded,
  ClerkLoading,
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/nextjs"
import { useEffect, useState } from "react"

import { Button } from "~/components/ui/button"
import LatestFineList from "~/components/hompage-fine-list"
import {
  Plus,
  FileText,
  Edit,
  BotIcon as Robot,
  Loader2,
} from "lucide-react"
import { motion } from "framer-motion"

interface FineType {
  id: number
  paragraphTitle: string
  offenderName: string
  numFines: number
  paragraphShortId: string
  description: string
  date: string
  issuerName: string
  imageLink?: string
}

function Spinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

function AuthenticatedHome() {
  const { userId } = useAuth()
  const [profileName, setProfileName] = useState<string | null>(null)
  const [latestFines, setLatestFines] = useState<FineType[]>([])
  const [loadingFines, setLoadingFines] = useState(true)

  useEffect(() => {
    if (!userId) return

    ;(async () => {
      try {
        const res = await fetch("/api/profile")
        if (res.ok) {
          const data = await res.json()
          setProfileName(data.username)
        }
      } catch (err) {
        console.error("Error fetching profile", err)
      }
    })()
  }, [userId])

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/fine?limit=5")
        if (!res.ok) throw new Error(`Failed: ${res.status}`)
        setLatestFines(await res.json())
      } catch (err) {
        console.error("Error fetching fines", err)
      } finally {
        setLoadingFines(false)
      }
    })()
  }, [])

  if (loadingFines) return <Spinner />

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-8">
        {profileName ? `Hei, ${profileName}!` : "Aperturr."}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full px-4">
        <Link href="/fine/create" className="w-full">
          <Button
            variant="default"
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <Robot className="h-4 w-4" />
            <span>Opprett ny bot</span>
          </Button>
        </Link>

        <Link href="/fines" className="w-full">
          <Button
            variant="default"
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <FileText className="h-4 w-4" />
            <span>Bøter</span>
          </Button>
        </Link>

        <Link href="admin/paragraph/create" className="w-full">
          <Button
            variant="default"
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Opprett paragraf</span>
          </Button>
        </Link>

        <Link href="admin/paragraph/edit" className="w-full">
          <Button
            variant="default"
            className="w-full h-12 flex items-center justify-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span>Rediger paragrafer</span>
          </Button>
        </Link>
      </div>

      <LatestFineList fines={latestFines} />

      <Link
        href="/fine/create"
        className="fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <Plus className="h-5 w-5" />
      </Link>
    </main>
  )
}


export default function HomePage() {
  return (
    <>
      <ClerkLoading>
        <Spinner />
      </ClerkLoading>

      <ClerkLoaded>
        <SignedOut>
          <main className="flex min-h-screen flex-col items-center justify-center mt-[-4rem]">
            <motion.h1
              className="text-5xl sm:text-6xl font-extrabold tracking-tight"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, ease: "backOut" }}
            >
              {"Gjør deg til kjenne.".split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: 0.3 + i * 0.03,
                    duration: 0.6,
                    ease: "backOut",
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.h1>
          </main>
        </SignedOut>

        <SignedIn>
          <AuthenticatedHome />
        </SignedIn>
      </ClerkLoaded>
    </>
  )
}