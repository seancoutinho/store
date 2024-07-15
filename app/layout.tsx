import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { ModalProvider } from "@/providers/modal-provider";

export const metadata: Metadata = {
  title: "KevTech Store",
  description: "Buy the latest tech gadgets at KevTech Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <ClerkProvider>
      <html lang="en">
        <body className="p-4">
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
