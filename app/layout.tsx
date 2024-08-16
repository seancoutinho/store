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
import ModalProvider from "@/providers/modal-provider";
import { ToastProvider } from "@/providers/toast-providers";

export const metadata: Metadata = {
  title: "ByteStream Store",
  description: "Buy the latest tech gadgets at ByteStream Store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedIn></SignedIn>
          <ToastProvider />
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
