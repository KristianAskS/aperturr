"use client"

import { usePathname } from "next/navigation"
import BackgroundPaths from "./BackgroundPaths"

export default function RootStripes() {
  const pathname = usePathname()
  return pathname === "/" ? <BackgroundPaths title="Aperturr" /> : null
}