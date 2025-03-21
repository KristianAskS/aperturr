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

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
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
              <SignUpButton />
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