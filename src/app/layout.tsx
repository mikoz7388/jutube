import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster as Toasterold } from "@/components/ui/toaster";
import { TRPCProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jutuboza",
  description: "Nice video watching site",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Script
          src="/scripts/newrelic.js"
          strategy="afterInteractive"
          id="newrelic-script"
        />
        <TRPCProvider>
          {children}
          <Toaster richColors />
          <Toasterold />
        </TRPCProvider>
      </body>
    </html>
  );
}
