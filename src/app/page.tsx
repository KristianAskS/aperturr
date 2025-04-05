/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { Button } from "~/components/ui/button"
import { Plus, FileText, Edit, BotIcon as Robot, Loader2 } from "lucide-react"
import LatestFineList from "~/components/hompage-fine-list"

interface FineType {
  id: number;
  paragraphTitle: string;
  offenderName: string;
  numFines: number;
  paragraphShortId: string;
  description: string;
  date: string;
  issuerName: string;
  imageLink?: string;
}

export default function HomePage() {
  const { userId } = useAuth()
  const [name, setName] = useState<string | null>(null)
  const [didWait, setDidWait] = useState(false)
  const [latestFines, setLatestFines] = useState<FineType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [profileLoaded, setProfileLoaded] = useState(false)

  // Wait 2 seconds before showing "Gjør deg til kjenne."
  useEffect(() => {
    const timer = setTimeout(() => setDidWait(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!userId) {
      setProfileLoaded(true)
      return
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile")
        const data = await res.json()
        if (res.ok) {
          setName(data.username)
        } else {
          console.error("Failed to fetch profile:", data.message)
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setProfileLoaded(true)
      }
    }

    fetchProfile()
  }, [userId])

  useEffect(() => {
    const fetchLatestFines = async () => {
      setIsLoading(true)
      try {
        const res = await fetch("/api/fine?limit=5")
        if (!res.ok) {
          throw new Error(`Failed to fetch fines. Status: ${res.status}`)
        }
        const data = await res.json()
        setLatestFines(data)
      } catch (err) {
        console.error("Error fetching the 5 newest fines:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestFines()
  }, [])

  if (isLoading || !profileLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!userId && didWait) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-2">
        <h1 className="text-5xl font-bold">Gjør deg til kjenne.</h1>
      </main>
    )
  }

  if (!userId && !didWait) {
    return null
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-8">Aperturr.</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md w-full px-4">
        <Link href="/fine/create" className="w-full">
          <Button variant="default" className="w-full h-12 text-base flex items-center justify-center gap-2">
            <Robot className="h-4 w-4" />
            <span>Opprett ny bot</span>
          </Button>
        </Link>

        <Link href="/fines" className="w-full">
          <Button variant="default" className="w-full h-12 text-base flex items-center justify-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Bøter</span>
          </Button>
        </Link>

        <Link href="admin/paragraph/create" className="w-full">
          <Button variant="default" className="w-full h-12 text-base flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Opprett paragraf</span>
          </Button>
        </Link>

        <Link href="admin/paragraph/edit" className="w-full">
          <Button variant="default" className="w-full h-12 text-base flex items-center justify-center gap-2">
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

