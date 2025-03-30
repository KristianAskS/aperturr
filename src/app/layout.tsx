import "~/styles/globals.css";
import { ThemeProvider } from "~/components/theme-provider";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

// import teh basement-font



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
        url: "https://images.steamusercontent.com/ugc/947329247059594679/7452EDDCDDA67C21F8558191E42CD4E07187988B/?imw=512&imh=512&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true",
        width: 512,
        height: 512,
        alt: "Aperturr",
      },
    ],
    siteName: "Aperturr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      
      <html lang="en" className={`${GeistSans.variable}`} suppressHydrationWarning>
        <body suppressHydrationWarning>
          
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}