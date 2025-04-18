import "~/styles/globals.css"
import { ThemeProvider } from "~/components/theme-provider"
import RootStripes from "~/components/RootStripes"
import { GeistSans } from "geist/font/sans"

import type { Metadata } from "next"
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

export const metadata: Metadata = {
  title: "Aperturr",
  description: "Aperturrbotsystemet",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    url: "https://aperturr.no",
    title: "Aperturr",
    description: "Aperturrbotsystemet",
    images: [
      {
        url: "https://images.steamusercontent.com/ugc/947329247059594679/7452EDDCDDA67C21F8558191E42CD4E07187988B/?imw=512&imh=512&ima=fit",
        width: 128,
        height: 128,
        alt: "Aperturr icon",
      },
    ],
    siteName: "Aperturr",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={GeistSans.variable}>
        <body className="relative min-h-screen bg-white dark:bg-neutral-950 overflow-x-hidden">
          <RootStripes />
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="relative z-10 flex flex-col min-h-screen">
            <header className="flex justify-end items-center p-4 gap-4 h-16 bg-white dark:bg-neutral-950 z-50">
                <SignedOut>
                  <SignInButton />
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </header>
              <main className="flex-1">{children}</main>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}